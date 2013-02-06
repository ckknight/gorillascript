let {inspect} = require 'util'

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
  def complement
  def array() -> @_array ?= ArrayType(this)
  def function() -> @_function ?= FunctionType(this)
  
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
    if alpha == bravo
      0
    else
      let len = alpha.length
      let mutable c = len <=> bravo.length
      if c
        c
      else
        for i in 0 til len
          c := alpha[i].compare(bravo[i])
          if c
            return c
        0
  
  let equals(alpha, bravo) as Boolean
    if alpha == bravo
      true
    else
      let len = alpha.length
      if len != bravo.length
        false
      else
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
  @from-JSON := #(x)
    if not x or typeof x != \object
      throw TypeError "Expected an Object, got $(typeof x)"
    let type = x.type
    if typeof type != \string
      throw TypeError "Unspecified type"
    else if from-JSON-types not ownskey type
      throw TypeError "Unknown serialization type: $type"
    else
      from-JSON-types[type] x
  
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
    
    def complement() -> @_complement ?= ComplementType this
    
    def inspect()
      for first k, v of Type
        if v == this
          "Type.$k"
      else
        "Type.make($(inspect @name))"
    
    def to-JSON()
      for first k, v of Type
        if v == this
          { type: \simple, name: k }
      else
        throw Error "Cannot serialize custom type: $(String this)"
    from-JSON-types.simple := #({name}) -> Type![name] or throw Error "Unknown type: $(String name)"
  @make := #(name) -> SimpleType(name)
  
  class ArrayType extends Type
    def constructor(@subtype as Type)
      @id := get-id()
    
    let become(alpha, bravo)!
      if alpha.id < bravo.id
        bravo.subtype := alpha.subtype
        bravo.id := alpha.id
      else
        alpha.subtype := bravo.subtype
        alpha.id := bravo.id
    
    def to-string() -> @_name ?= if @subtype == any then "[]" else "[$(String @subtype)]"
    
    def equals(other)
      if other == this
        true
      else if other instanceof ArrayType
        if @id == other.id
          true
        else if @subtype.equals(other.subtype)
          become(this, other)
          true
        else
          false
      else
        false
    
    def compare(other)
      if @equals(other)
        0
      else if other instanceof ArrayType
        @subtype.compare(other.subtype)
      else
        "ArrayType" <=> other.constructor.display-name
    
    def union(other as Type)
      if other instanceof ArrayType
        if @equals(other)
          this
        else if @subtype.is-subset-of(other.subtype)
          other
        else if other.subtype.is-subset-of(@subtype)
          this
        else
          make-union-type [this, other], true
      else if other instanceof SimpleType
        make-union-type [this, other], true
      else
        other.union this
    
    def intersect(other as Type)
      if other instanceof ArrayType
        if @equals(other)
          this
        else if @subtype.is-subset-of(other.subtype)
          this
        else if other.subtype.is-subset-of(@subtype)
          other
        else
          none.array()
      else if other instanceof SimpleType
        none
      else
        other.intersect this

    def is-subset-of(other as Type)
      if other instanceof ArrayType
        @subtype.is-subset-of(other.subtype)
      else if other instanceof UnionType
        for some type in other.types by -1
          @is-subset-of(type)
      else if other instanceof ComplementType
        not @is-subset-of(other.untype)
      else
        other == any

    def overlaps(other as Type)
      if other instanceof ArrayType
        @subtype.overlaps(other.subtype)
      else if other instanceof SimpleType
        false
      else
        other.overlaps this

    def complement() -> @_complement ?= ComplementType this
    def inspect(depth)
      if @subtype == any
        "Type.array"
      else
        "$(inspect @subtype, null, depth).array()"
    
    def to-JSON() -> { type: \array, @subtype }
    from-JSON-types.array := #({subtype}) -> Type.from-JSON(subtype).array()
  
  class ObjectType extends Type
    def constructor(data)
      if typeof data != \object or data instanceof RegExp
        throw TypeError "Expected an object, got $(typeof! data)"
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
      if alpha.id < bravo.id
        bravo.pairs := alpha.pairs
        bravo.id := alpha.id
      else
        alpha.pairs := bravo.pairs
        alpha.id := bravo.id
    
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
      else if other instanceofsome [SimpleType, ArrayType]
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
      else if other instanceofsome [SimpleType, ArrayType]
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
      else if other instanceofsome [SimpleType, ArrayType]
        false
      else
        other.overlaps this

    def complement() -> @_complement ?= ComplementType this
    
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
    def to-JSON()
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
  
  class FunctionType extends Type
    def constructor(@return-type as Type)
      @id := get-id()

    def to-string() -> @_name ?= if @return-type == any then "->" else "-> $(String @return-type)"
    
    let become(alpha, bravo)
      if alpha.id < bravo.id
        bravo.return-type := alpha.return-type
        bravo.id := alpha.id
      else
        alpha.return-type := bravo.return-type
        alpha.id := bravo.id
    
    def equals(other)
      if other == this
        true
      else if other instanceof FunctionType
        if @id == other.id
          true
        else if @return-type.equals(other.return-type)
          become(this, other)
          true
        else
          false
      else
        false

    def compare(other)
      if this == other
        0
      else if other instanceof FunctionType
        if @id == other.id
          0
        else
          let cmp = @return-type.compare(other.return-type)
          if cmp == 0
            become(this, other)
          cmp
      else
        "FunctionType" <=> other.constructor.display-name

    def union(other as Type)
      if other instanceof FunctionType
        if @equals(other)
          this
        else if @return-type.is-subset-of(other.return-type)
          other
        else if other.return-type.is-subset-of(@return-type)
          this
        else
          make-union-type [this, other], true
      else if other instanceofsome [SimpleType, ArrayType, ObjectType]
        make-union-type [this, other], true
      else
        other.union this

    def intersect(other as Type)
      if other instanceof FunctionType
        if @equals(other)
          this
        else if @return-type.is-subset-of(other.return-type)
          this
        else if other.return-type.is-subset-of(@return-type)
          other
        else
          none.function()
      else if other instanceofsome [SimpleType, ArrayType, ObjectType]
        none
      else
        other.intersect this

    def is-subset-of(other as Type)
      if other instanceof FunctionType
        @return-type.is-subset-of(other.return-type)
      else if other instanceof UnionType
        for some type in other.types by -1
          @is-subset-of(type)
      else if other instanceof ComplementType
        not @is-subset-of(other.untype)
      else
        other == any

    def overlaps(other as Type)
      if other instanceof FunctionType
        @return-type.overlaps(other.return-type)
      else if other instanceofsome [SimpleType, ArrayType, ObjectType]
        false
      else
        other.overlaps this

    def complement() -> @_complement ?= ComplementType this
    def inspect(depth)
      if @return-type == any
        "Type.function"
      else
        "$(inspect @return-type, null, depth).function()"
    
    def to-JSON() -> { type: \function, @return-type }
    from-JSON-types.function := #({return-type}) -> Type.from-JSON(return-type).function()
  
  class UnionType extends Type
    def constructor(@types as [Type])
      if types.length <= 1
        throw Error "Must provide at least 2 types to UnionType"
      @id := get-id()
    
    def to-string() -> @_name ?= "($(@types.join '|'))"
    
    let become(alpha, bravo)
      if alpha.id < bravo.id
        bravo.types := alpha.types
        bravo.id := alpha.id
      else
        alpha.types := bravo.types
        alpha.id := bravo.id
    
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
      if other instanceofsome [SimpleType, ArrayType, FunctionType]
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
      if other instanceofsome [SimpleType, ArrayType, ObjectType, FunctionType]
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
      else if other instanceofsome [ArrayType, ObjectType, FunctionType]
        for some type in @types by -1
          type.overlaps(other)
      else if other instanceof UnionType
        overlaps @types, other.types
      else
        other.overlaps this
    
    def complement() -> @_complement ?= ComplementType this
    def inspect(depth)
      "(" & (for type in @types; inspect type, null, if depth? then depth - 1 else null).join(").union(") & ")"
    
    def to-JSON() -> { type: \union, @types }
    from-JSON-types.union := #({types})
      for reduce type in types by -1, current = Type.none
        current.union(Type.from-JSON(type))

  class ComplementType extends Type
    def constructor(untype as Type)
      @untype := untype
      @id := get-id()
    
    def to-string() -> @_name ?= "any \\ $(String @untype)"
    
    let become(alpha, bravo)
      if alpha.id < bravo.id
        bravo.id := alpha.id
        bravo.untype := alpha.untype
      else
        alpha.id := bravo.id
        alpha.untype := bravo.untype
    
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
      if other instanceofsome [SimpleType, ArrayType, ObjectType, FunctionType]
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
      if other instanceofsome [SimpleType, ArrayType, ObjectType, FunctionType]
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
      if other instanceofsome [SimpleType, ArrayType, FunctionType]
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
    
    def to-JSON() -> { type: \complement, untype: @complement() }
    from-JSON-types.complement := #({untype}) -> Type.from-JSON(untype).complement()
  
  let any = @any := new class AnyType extends Type
    def constructor()
      if any
        throw Error "Cannot instantiate more than once"
    
    def to-string() -> "any"
    
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
    
    def to-JSON() -> { type: \any }
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
    
    def to-JSON() -> { type: \none }
    from-JSON-types.none := #-> none
  
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
