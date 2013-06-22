import 'shared.gs'

require! util
let inspect = util?.inspect

module.exports := class Type
  def constructor()
    throw TypeError "Type should not be instantiated"
  
  def is-subset-of
  def is-superset-of(other) -> other.is-subset-of(this)
  def overlaps
  def compare
  def equals
  def union
  def intersect
  def complement() -> @_complement ?= ComplementType this
  def array() -> @_array ?= Type.generic(array-base, this)
  def function(...args) -> @_function ?= Type.generic(function-base, this, ...args)
  def return-type() -> none
  
  let contains(alpha, bravo) as Boolean
    for item in alpha by -1
      if item.equals(bravo)
        return true
    false
  
  let union(alpha, bravo) as [Type]
    if alpha == bravo
      return alpha
    let result = []
    let alpha-len = alpha.length
    let bravo-len = bravo.length
    let mutable i = 0
    let mutable j = 0
    while i < alpha-len and j < bravo-len
      let a = alpha[i]
      let b = bravo[j]
      let cmp = a.compare(b)
      if cmp == 0
        result.push a
        i += 1
        j += 1
      else if cmp < 0
        result.push a
        i += 1
      else
        result.push b
        j += 1
    while i < alpha-len, i += 1
      result.push alpha[i]
    while j < bravo-len, j += 1
      result.push bravo[j]
    
    switch result.length
    case alpha-len; alpha
    case bravo-len; bravo
    default; result
  
  let intersect(alpha, bravo) as [Type]
    if alpha == bravo
      return alpha
    let alpha-len = alpha.length
    let bravo-len = bravo.length
    
    let result = []
    
    let mutable i = 0
    let mutable j = 0
    while i < alpha-len and j < bravo-len
      let a = alpha[i]
      let b = bravo[j]
      let cmp = a.compare(b)
      if cmp == 0
        result.push a
        i += 1
        j += 1
      else if cmp < 0
        i += 1
      else
        j += 1
    
    switch result.length
    case alpha-len; alpha
    case bravo-len; bravo
    default; result
  
  let relative-complement(alpha, bravo) as [Type]
    if alpha == bravo
      return []
    let result = []
    let alpha-len = alpha.length
    if alpha-len == 0
      return result
    let bravo-len = bravo.length
    if bravo-len == 0
      return alpha
    let mutable i = 0
    let mutable j = 0
    while i < alpha-len and j < bravo-len
      let a = alpha[i]
      let cmp = a.compare(bravo[j])
      if cmp == 0
        i += 1
        j += 1
      else if cmp < 0
        result.push a
        i += 1
      else
        j += 1
    while i < alpha-len, i += 1
      result.push alpha[i]
    if result.length == alpha-len
      alpha
    else
      result
  
  let is-subset-of(alpha, bravo) as Boolean
    if alpha == bravo
      return true
    let alpha-len = alpha.length
    if alpha-len == 0
      return true
    let bravo-len = bravo.length
    if alpha-len > bravo-len
      false
    else  
      let mutable i = 0
      let mutable j = 0
      while j < bravo-len
        if alpha[i].equals(bravo[j])
          i += 1
          if i >= alpha-len
            return true
          j += 1
        else
          j += 1
      false
  
  let overlaps(alpha, bravo) as Boolean
    let alpha-len = alpha.length
    if alpha == bravo and alpha-len > 0
      return true
    let bravo-len = bravo.length
    let mutable i = 0
    let mutable j = 0
    while i < alpha-len and j < bravo-len
      let cmp = alpha[i].compare(bravo[j])
      if cmp == 0
        return true
      else if cmp < 0
        i += 1
      else
        j += 1
    false
  
  let compare(alpha, bravo) as Number
    if alpha != bravo
      let len = alpha.length
      returnif len <=> bravo.length
      for i in 0 til len
        returnif alpha[i].compare(bravo[i])
    0
  
  let equals(alpha, bravo) as Boolean
    if alpha != bravo
      let len = alpha.length
      returnunless len == bravo.length
      for i in 0 til len
        unless alpha[i].equals(bravo[i])
          return false
    true
  
  let type-comparer(a, b) as Number -> a.compare(b)
  
  let make-union-type(types, needs-sort) as Type
    switch types.length
    case 0; none
    case 1; types[0]
    default
      if needs-sort
        types.sort type-comparer
      UnionType(types)
  
  let from-JSON-types = {}
  let from-JSON(x)
    if is-string! x
      from-JSON { type: \simple, name: x }
    else
      let type = x.type
      if not is-string! type
        throw TypeError "Unspecified type"
      else if from-JSON-types not ownskey type
        throw TypeError "Unknown serialization type: $type"
      else
        from-JSON-types[type] x
  @from-JSON := from-JSON
  
  let get-id = do
    let mutable id = -1
    #
      id += 1
      id
  
  class SimpleType extends Type
    def constructor(@name as String)
      @id := get-id()
    
    def to-string() -> @name
    
    def equals(other) -> this == other

    def return-type()
      if this == function-base
        any
      else
        none
    
    def compare(other)
      if this == other
        0
      else if other instanceof SimpleType
        @name <=> other.name or @id <=> other.id
      else
        "SimpleType" <=> other.constructor.display-name
    
    def union(other as Type)
      if other instanceof SimpleType
        if this == other
          this
        else
          make-union-type [this, other], true
      else
        other.union this
    
    def intersect(other as Type)
      if other instanceof SimpleType
        if this == other
          this
        else
          none
      else
        other.intersect this
    
    def is-subset-of(other as Type)
      if other instanceof SimpleType
        this == other
      else if other instanceof UnionType
        for some type in other.types by -1
          this == type
      else if other instanceof ComplementType
        not @is-subset-of(other.untype)
      else
        other == any
    
    def overlaps(other as Type)
      if other instanceof SimpleType
        this == other
      else
        other.overlaps this
    
    def inspect()
      for first k, v of Type
        if v == this
          "Type.$k"
      else
        "Type.make($(inspect @name))"
    
    def to-ast(ast, pos, ident)
      for first k, v of Type
        if v == this
          ast.Access pos, ident, ast.Const pos, k
      else
        throw Error "Cannot serialize custom type: $(String this)"
    
    def to-JSON()
      for first k, v of Type
        if v == this
          k
      else
        throw Error "Cannot serialize custom type: $(String this)"
    from-JSON-types.simple := #({name}) -> Type![name] or throw Error "Unknown type: $(String name)"
  @make := #(name) -> SimpleType(name)
  
  class GenericType extends Type
    def constructor(@base as SimpleType, args as [Type])
      if args.length == 0
        throw Error "Must provide at least one generic type argument"
      @id := get-id()
      @args := args.slice()
      if @base == array-base and args.length == 1
        return? args[0]._array
        args[0]._array := this
      else if @base == function-base and args.length == 1
        return? args[0]._function
        args[0]._function := this

    let become(alpha, bravo)!
      if alpha.id > bravo.id
        return become bravo, alpha
      bravo.base := alpha.base
      bravo.args := alpha.args
      bravo.id := alpha.id

    def to-string() -> @_name ?=
      if @base == array-base and @args.length == 1
        if @args[0] == any
          "[]"
        else
          "[$(String @args[0])]"
      else if @base == function-base and @args.length == 1
        if @args[0] == any
          "->"
        else
          "-> $(String @args[0])"
      else
        let sb = []
        sb.push String @base
        sb.push "<"
        for arg, i in @args
          if i > 0
            sb.push ","
            if arg != any and @args[i - 1] != any
              sb.push " "
          if arg != any
            sb.push String arg
        sb.push ">"
        sb.join ""

    def return-type()
      if @base == function-base
        @args[0]
      else
        none

    def equals(other)
      if other == this
        true
      else if other instanceof GenericType
        if @id == other.id
          true
        else if @base == other.base and equals(@args, other.args)
          become(this, other)
          true
        else
          false
      else
        false

    def compare(other)
      if other == this
        0
      else if other instanceof GenericType
        if @id == other.id
          0
        else
          returnif @base.compare(other.base)
          let cmp = compare @args, other.args
          if not cmp
            become this, other
          cmp
      else
        "GenericType" <=> other.constructor.display-name

    def union(other as Type)
      if other instanceof GenericType
        if @equals(other)
          this
        else if @is-subset-of(other)
          other
        else if other.is-subset-of(this)
          this
        else
          make-union-type [this, other], true
      else if other instanceof SimpleType
        make-union-type [this, other], true
      else
        other.union this
    
    def intersect(other as Type)
      if other instanceof GenericType
        if @base != other.base
          none
        else if @equals(other)
          this
        else
          let args = @args
          let other-args = other.args
          let len = args.length
          if len != other-args.length
            none
          else
            let mutable is-this = true
            let mutable is-other = true
            let new-args = []
            for i in 0 til len
              let arg = args[i]
              let other-arg = other-args[i]
              let new-arg = args[i].intersect(other-args[i])
              if is-this and arg != new-arg
                is-this := false
              if is-other and other-arg != new-arg
                is-other := false
              new-args.push new-arg
            if is-this
              this
            else if is-other
              other
            else
              GenericType @base, new-args
      else if other instanceof SimpleType
        none
      else
        other.intersect this
    
    def is-subset-of(other as Type)
      if other instanceof GenericType
        if @base != other.base
          false
        else if @equals(other)
          true
        else
          let args = @args
          let other-args = other.args
          let len = args.length
          if len != other-args.length
            false
          else
            for i in 0 til len
              unless args[i].is-subset-of(other-args[i])
                return false
            true
      else if other instanceof UnionType
        for some type in other.types by -1
          @is-subset-of(type)
      else if other instanceof ComplementType
        not @is-subset-of(other.untype)
      else
        other == any
    
    def overlaps(other as Type)
      if other instanceof GenericType
        if @base != other.base
          false
        else
          @args.length == other.args.length
      else if other instanceof SimpleType
        false
      else
        other.overlaps this
    
    def inspect(mutable depth)
      if depth?
        depth -= 1
      let sb = ["Type.generic("]
      sb.push inspect @base, null, depth
      for arg in @args
        sb.push ", "
        sb.push inspect arg, null, depth
      sb.push ")"
      sb.join ""
    
    def to-ast(ast, pos, ident)
      for first k, v of Type
        if v == this
          ast.Access pos, ident, ast.Const pos, k
      else
        ast.Call pos,
          ast.Access pos, ident, ast.Const pos, \generic
          [
            @base.to-ast ast, pos, ident
            ...for arg in @args
              arg.to-ast ast, pos, ident
          ]
    
    def to-JSON()
      for first k, v of Type
        if v == this
          k
      else
        { type: \generic, @base, @args }
    from-JSON-types.generic := #({base, args})
      let base-type = Type.from-JSON(base)
      if base-type == array-base and args.length == 1
        Type.from-JSON(args[0]).array()
      else if base-type == function-base and args.length == 1
        Type.from-JSON(args[0]).function()
      else
        GenericType base-type, (for arg in args; Type.from-JSON(arg))
  @generic := #(base, ...args)
    GenericType(
      if is-string! base then Type.make(base) else base
      args)
  
  class ObjectType extends Type
    def constructor(data as Object)
      let pairs = []
      for k, v of data
        if v not instanceof Type
          throw TypeError "Expected data[$(JSON.stringify k)] to be a Type, got $(typeof! v)"
        if v != any
          pairs.push [k, v]
      pairs.sort #(a, b) -> a[0] <=> b[0]
      if pairs.length == 0 and Type.object?
        return Type.object
      @pairs := pairs
      @id := get-id()
    
    def to-string() -> @_name ?= "{$((for [k, v] in @pairs; "$k: $(String v)").join ', ')}"
    
    let become(alpha, bravo)!
      if alpha.id > bravo.id
        return become bravo, alpha
      bravo.pairs := alpha.pairs
      bravo.id := alpha.id
    
    def equals(other)
      if other == this
        true
      else if other instanceof ObjectType
        let pairs = @pairs
        let other-pairs = other.pairs
        if pairs == other-pairs
          true
        else if pairs.length != other-pairs.length
          false
        else
          for pair, i in pairs
            let other-pair = other-pairs[i]
            if pair[0] != other-pair[0] or not pair[1].equals(other-pair[1])
              return false
          become(this, other)
          true
      else
        false
    
    def compare(other)
      if this == other
        0
      else if other instanceof ObjectType
        let pairs = @pairs
        let other-pairs = other.pairs
        if pairs == other-pairs
          0
        else
          let mutable cmp = pairs.length <=> other-pairs.length
          if cmp
            cmp
          else
            for pair, i in pairs
              let other-pair = other-pairs[i]
              cmp := pair[0] <=> other-pair[0] or pair[1].compare(other-pair[1])
              if cmp
                return cmp
            become(this, other)
            0
      else
        "ObjectType" <=> other.constructor.display-name

    def union(other as Type)
      if other instanceof ObjectType
        if @equals(other)
          this
        else if @is-subset-of(other)
          other
        else if other.is-subset-of(this)
          this
        else
          make-union-type [this, other], true
      else if other instanceofsome [SimpleType, GenericType]
        make-union-type [this, other], true
      else
        other.union this

    def intersect(other as Type)
      if other instanceof ObjectType
        if @equals(other)
          this
        else if @is-subset-of(other)
          this
        else if other.is-subset-of(this)
          other
        else
          let merged = {}
          for [k, v] in @pairs
            merged[k] := v
          for [k, v] in other.pairs
            if merged ownskey k
              merged[k] := merged[k].intersect(v)
            else
              merged[k] := v
          ObjectType merged
      else if other instanceofsome [SimpleType, GenericType]
        none
      else
        other.intersect this

    def is-subset-of(other as Type)
      if other instanceof ObjectType
        if this == other or other == Type.object
          true
        else if this == Type.object
          false
        else
          let pairs = @pairs
          let other-pairs = other.pairs
          if pairs == other.pairs
            true
          else
            let mutable i = 0
            let len = pairs.length
            for [other-k, other-v] in other-pairs
              while i <= len, i += 1
                if i == len
                  return false
                let pair = pairs[i]
                if pair[0] == other-k
                  if pair[1].is-subset-of(other-v)
                    i += 1
                    break
                  else
                    return false
                else if pair[0] > other-k
                  return false
            if i == len
              become(this, other)
            true
      else if other instanceof UnionType
        for some type in other.types by -1
          @is-subset-of(type)
      else if other instanceof ComplementType
        not @is-subset-of(other.untype)
      else
        other == any

    def overlaps(other as Type)
      if other instanceof ObjectType
        // seeing as any unspecified key can overlap with another unspecified key, there's an overlap
        true
      else if other instanceofsome [SimpleType, GenericType]
        false
      else
        other.overlaps this
    
    def value(key as String)
      for pair in @pairs by -1
        let pair-key = pair[0]
        if pair-key == key
          return pair[1]
        else if pair-key ~< key
          return Type.any
      Type.any
    
    def inspect(depth)
      if this == Type.object
        "Type.object"
      else
        let obj = {}
        for [k, v] in @pairs
          obj[k] := v
        "Type.makeObject($(inspect obj, null, if depth? then depth - 1 else null))"
    
    def to-ast(ast, pos, ident)
      if @pairs.length == 0
        ast.Access pos, ident, ast.Const pos, \object
      else
        ast.Call pos,
          ast.Access pos, ident, ast.Const pos, \make-object
          [ast.Obj pos, for [k, v] in @pairs
            ast.Obj.Pair pos, k, v.to-ast ast, pos, ident]
    def to-JSON()
      if @pairs.length == 0
        \object
      else
        let pairs = {}
        for [k, v] in @pairs
          pairs[k] := v
        { type: \object, pairs }
    from-JSON-types.object := #({pairs})
      let deserialized-pairs = {}
      for k, v of pairs
        deserialized-pairs[k] := Type.from-JSON(v)
      ObjectType deserialized-pairs
  @make-object := #(data) -> ObjectType(data)
  
  class UnionType extends Type
    def constructor(@types as [Type])
      if types.length <= 1
        throw Error "Must provide at least 2 types to UnionType"
      @id := get-id()
    
    def to-string() -> @_name ?= "($(@types.join '|'))"

    def return-type()
      for reduce type in @types, current = none
        current.union(type.return-type())
    
    let become(alpha, bravo)
      if alpha.id > bravo.id
        return become bravo, alpha
      bravo.types := alpha.types
      bravo.id := alpha.id
    
    def equals(other)
      if other == this
        true
      else if other instanceof UnionType
        if @id == other.id
          true
        else if @types == other.types or equals @types, other.types
          become(this, other)
          true
        else
          false
      else
        false
    
    def compare(other)
      if other == this
        0
      else if other instanceof UnionType
        if @id == other.id
          0
        else if @types == other.types
          become(this, other)
          0
        else
          let cmp = compare @types, other.types
          if cmp == 0
            become(this, other)
          cmp
      else
        "UnionType" <=> other.constructor.display-name
    
    def union(other as Type)
      if other instanceofsome [SimpleType, GenericType]
        let types = union @types, [other]
        if types == @types
          this
        else
          make-union-type types
      else if other instanceof ObjectType
        if other == Type.object
          let new-types = [other]
          for type in @types
            if type instanceof ObjectType
              if type == Type.object
                return this
            else
              new-types.push type
          make-union-type new-types
        else
          let new-types = [other]
          for type in @types
            if type instanceof ObjectType
              if other.is-subset-of type
                return this
              else if not type.is-subset-of other
                new-types.push type
            else
              new-types.push type
          make-union-type new-types
      else if other instanceof UnionType
        let types = union @types, other.types
        if types == @types
          this
        else if types == other.types
          other
        else
          make-union-type types
      else
        other.union this
    
    def intersect(other as Type)
      if other instanceofsome [SimpleType, GenericType, ObjectType]
        make-union-type intersect @types, [other]
      else if other instanceof UnionType
        let types = intersect @types, other.types
        if types == @types
          this
        else if types == other.types
          other
        else
          make-union-type types
      else
        other.intersect this
    
    def is-subset-of(other as Type)
      if other instanceof UnionType
        is-subset-of @types, other.types
      else if other instanceof ComplementType
        not @overlaps other.untype
      else
        other == any
    
    def overlaps(other as Type)
      if other instanceof SimpleType
        contains @types, other
      else if other instanceofsome [GenericType, ObjectType]
        for some type in @types by -1
          type.overlaps(other)
      else if other instanceof UnionType
        overlaps @types, other.types
      else
        other.overlaps this
    
    def inspect(depth)
      "(" & (for type in @types; inspect type, null, if depth? then depth - 1 else null).join(").union(") & ")"
    
    def to-ast(ast, pos, ident)
      for first k, v of Type
        if v == this
          ast.Access pos, ident, ast.Const pos, k
      else
        for reduce type in @types[1 to -1], current = @types[0].to-ast(ast, pos, ident)
          ast.Call pos,
            ast.Access pos, current, ast.Const pos, \union
            [type.to-ast ast, pos, ident]
    
    def to-JSON()
      for first k, v of Type
        if v == this
          k
      else
        { type: \union, @types }
    from-JSON-types.union := #({types})
      for reduce type in types by -1, current = Type.none
        current.union(Type.from-JSON(type))

  class ComplementType extends Type
    def constructor(untype as Type)
      @untype := untype
      @id := get-id()
    
    def to-string() -> @_name ?= "any \\ $(String @untype)"

    def return-type() -> any
    
    let become(alpha, bravo)
      if alpha.id > bravo.id
        return become bravo, alpha
      bravo.id := alpha.id
      bravo.untype := alpha.untype
    
    def equals(other)
      if this == other
        true
      else if other instanceof ComplementType
        if @id == other.id
          true
        else if @untype.equals(other.untype)
          become(this, other)
          true
        else
          false
      else
        false
    
    def compare(other)
      if this == other
        0
      else if other instanceof ComplementType
        if @id == other.id
          0
        else
          let cmp = @untype.compare(other.untype)
          if cmp == 0
            become(this, other)
          cmp
      else
        "ComplementType" <=> other.constructor.display-name
    
    let get-untypes(untype) as [Type]
      if untype instanceof UnionType
        untype.types
      else
        [untype]

    def union(other as Type)
      if other instanceofsome [SimpleType, GenericType, ObjectType]
        let my-untypes = get-untypes(@untype)
        let untypes = relative-complement my-untypes, [other]
        if untypes == my-untypes
          this
        else
          make-union-type(untypes).complement()
      else if other instanceof UnionType
        let my-untypes = get-untypes(@untype)
        let untypes = relative-complement my-untypes, other.types
        if untypes == my-untypes
          this
        else
          make-union-type(untypes).complement()
      else if other instanceof ComplementType
        @untype.intersect(other.untype).complement()
      else
        other.union this
    
    def intersect(other as Type)
      if other instanceofsome [SimpleType, GenericType, ObjectType]
        if contains get-untypes(@untype), other
          none
        else
          other
      else if other instanceof UnionType
        let types = relative-complement other.types, get-untypes(@untype)
        if types == other.types
          other
        else
          make-union-type types
      else if other instanceof ComplementType
        @untype.union(other.untype).complement()
      else
        other.intersect this
    
    def is-subset-of(other as Type)
      if other instanceof ComplementType
        other.untype.is-subset-of(@untype)
      else
        other == any
    
    def overlaps(other as Type)
      if other instanceofsome [SimpleType, GenericType]
        not @untype.overlaps(other)
      else if other instanceof ObjectType
        for every untype in get-untypes(@untype) by -1
          if untype instanceof ObjectType
            not other.is-subset-of untype
          else
            true
      else if other instanceof UnionType
        relative-complement(other.types, get-untypes(@untype)).length > 0
      else if other instanceof ComplementType
        true
      else
        other.overlaps this
    
    def complement() -> @untype
    
    def inspect(depth)
      @untype.inspect(depth) & ".complement()"
    
    def to-ast(ast, pos, ident)
      for first k, v of Type
        if v == this
          ast.Access pos, ident, ast.Const pos, k
      else
        ast.Call pos,
          ast.Access pos,
            @complement().to-ast ast, pos, ident
            ast.Const pos, \complement
          []
    
    def to-JSON()
      for first k, v of Type
        if v == this
          k
      else
        { type: \complement, untype: @complement() }
    from-JSON-types.complement := #({untype}) -> Type.from-JSON(untype).complement()
  
  let any = @any := new class AnyType extends Type
    def constructor()
      if any
        throw Error "Cannot instantiate more than once"
    
    def to-string() -> "any"

    def return-type() -> any
    
    def equals(other) -> this == other
    
    def compare(other)
      if this == other
        0
      else
        "AnyType" <=> other.constructor.display-name
    
    def union(other) -> this
    def intersect(other) -> other
    def is-subset-of(other) -> this == other
    def overlaps(other) -> true
    def complement() -> none
    def inspect() -> "Type.any"
    
    def to-ast(ast, pos, ident)
      ast.Access pos, ident, ast.Const pos, \any
    def to-JSON() -> \any
    from-JSON-types.any := #-> any
  
  let none = @none := new class NoneType extends Type
    def constructor()
      if none
        throw Error "Cannot instantiate more than once"
    
    def to-string() -> "none"
    
    def equals(other) -> this == other
    
    def compare(other)
      if this == other
        0
      else
        "NoneType" <=> other.constructor.display-name
    
    def union(other) -> other
    def intersect(other) -> this
    def is-subset-of(other) -> true
    def overlaps(other) -> false
    def complement() -> any
    def inspect() -> "Type.none"
    
    def to-ast(ast, pos, ident)
      ast.Access pos, ident, ast.Const pos, \none
    def to-JSON() -> \none
    from-JSON-types.none := #-> none
  
  let array-base = @array-base := @make "Array"
  let function-base = @function-base := @make "Function"
  @undefined := @make "undefined"
  @null := @make "null"
  @boolean := @make "Boolean"
  @string := @make "String"
  @string-array := @string.array()
  @number := @make "Number"
  @number-array := @number.array()
  @array := any.array()
  @args := @make "Arguments"
  @object := @make-object({})
  @function := any.function()
  @regexp := @make "RegExp"
  @date := @make "Date"
  @error := @make "Error"
  // technically promise.then should return a promise, but it's self-referential
  @promise := @make-object({then: @any.function(@function, @function)})
  @generator-result := @make-object({ done: @boolean, value: any })
  @generator := @generator-result.function()
  @numeric := @number.union(@undefined).union(@null).union(@boolean)
  @string-or-number := @string.union(@number)
  @array-like := @array.union(@args)
  @undefined-or-null := @undefined.union(@null)
  @not-undefined-or-null := @undefined-or-null.complement()
  @primitive := @undefined-or-null.union(@boolean).union(@string).union(@number)
  @non-primitive := @primitive.complement()
  @always-falsy := @undefined-or-null
  @potentially-truthy := @always-falsy.complement()
  @potentially-falsy := @always-falsy.union(@number).union(@string).union(@boolean)
  @always-truthy := @potentially-falsy.complement()
