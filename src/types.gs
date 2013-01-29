let {inspect} = require 'util'

module.exports := class Type
  def constructor()@
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
  
  let contains(alpha, bravo)
    for item in alpha by -1
      if item.equals(bravo)
        return true
    false
  
  let union(alpha, bravo)
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
  
  let intersect(alpha, bravo)
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
  
  let relative-complement(alpha, bravo)
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
  
  let is-subset-of(alpha, bravo)
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
  
  let overlaps(alpha, bravo)
    let alpha-len = alpha.length
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
  
  let compare(alpha, bravo)
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
  
  let equals(alpha, bravo)
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
  
  let type-comparer(a, b) -> a.compare(b)
  
  let make-union-type(types, needs-sort)
    switch types.length
    case 0; none
    case 1; types[0]
    default
      if needs-sort
        types.sort type-comparer
      UnionType(types)
  
  let make-complement-type(types)
    if types.length == 0
      any
    else
      ComplementType(types)
  
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
  
  class SimpleType extends Type
    let get-id = do
      let mutable id = -1
      #
        id += 1
        id
    
    def constructor(name as String)@
      @name := name
      @id := get-id()
    
    def to-string() -> @name
    
    def equals(other) -> this == other
    
    def compare(other)
      if this == other
        0
      else if other instanceof SimpleType
        @name <=> other.name or @id <=> other.id
      else
        "SimpleType" <=> other.constructor.name
    
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
        for every type in other.untypes by -1
          this != type
      else
        other == any
    
    def overlaps(other as Type)
      if other instanceof SimpleType
        this == other
      else
        other.overlaps this
    
    def complement() -> ComplementType [this]
    
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
    def constructor(subtype as Type)@
      @subtype := subtype
    
    def to-string() -> @_name ?= if @subtype == any then "[]" else "[$(String @subtype)]"
    
    def equals(other)
      other == this or (other instanceof ArrayType and @subtype.equals(other.subtype))
    
    def compare(other)
      if this == other
        0
      else if other instanceof ArrayType
        @subtype.compare(other.subtype)
      else
        "ArrayType" <=> other.constructor.name
    
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
        for every type in other.untypes by -1
          not @is-subset-of(type)
      else
        other == any

    def overlaps(other as Type)
      if other instanceof ArrayType
        @subtype.overlaps(other.subtype)
      else if other instanceof SimpleType
        false
      else
        other.overlaps this

    def complement() -> ComplementType [this]
    def inspect(depth)
      if @subtype == any
        "Type.array"
      else
        "$(inspect @subtype, null, depth).array()"
    
    def to-JSON() -> { type: \array, @subtype }
    from-JSON-types.array := #({subtype}) -> Type.from-JSON(subtype).array()
  
  class ObjectType extends Type
    def constructor(data)@
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
    
    def to-string() -> @_name ?= "{$((for [k, v] in @pairs; "$k: $(String v)").join ', ')}"
    
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
          let equal = for every pair, i in pairs
            let other-pair = other-pairs[i]
            pair[0] == other-pair[0] and pair[1].equals(other-pair[1])
          if equal
            other.pairs := pairs
          equal
      else
        false
    
    def compare(other)
      if this == other
        0
      else if other instanceof ObjectType
        let pairs = @pairs
        let other-pairs = other.pairs
        if pairs == other-pairs
          true
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
            other.pairs := pairs
            0
      else
        "ObjectType" <=> other.constructor.name

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
              other.pairs := pairs
            true
      else if other instanceof UnionType
        for some type in other.types by -1
          @is-subset-of(type)
      else if other instanceof ComplementType
        for every type in other.untypes by -1
          not @is-subset-of(type)
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

    def complement() -> ComplementType [this]
    
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
    def constructor(return-type as Type)@
      @return-type := return-type

    def to-string() -> @_name ?= if @return-type == any then "->" else "-> $(String @return-type)"

    def equals(other)
      other == this or (other instanceof FunctionType and @return-type.equals(other.return-type))

    def compare(other)
      if this == other
        0
      else if other instanceof FunctionType
        @return-type.compare(other.return-type)
      else
        "FunctionType" <=> other.constructor.name

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
        for every type in other.untypes by -1
          not @is-subset-of(type)
      else
        other == any

    def overlaps(other as Type)
      if other instanceof FunctionType
        @return-type.overlaps(other.return-type)
      else if other instanceofsome [SimpleType, ArrayType, ObjectType]
        false
      else
        other.overlaps this

    def complement() -> ComplementType [this]
    def inspect(depth)
      if @return-type == any
        "Type.function"
      else
        "$(inspect @return-type, null, depth).function()"
    
    def to-JSON() -> { type: \function, @return-type }
    from-JSON-types.function := #({return-type}) -> Type.from-JSON(return-type).function()
  
  class UnionType extends Type
    def constructor(types as [Type])@
      if types.length <= 1
        throw Error "Must provide at least 2 types to UnionType"
      @types := types
    
    def to-string() -> @_name ?= "($(@types.join '|'))"
    
    def equals(other)
      if other == this
        true
      else if other instanceof UnionType
        equals @types, other.types
      else
        false
    
    def compare(other)
      if other == this
        0
      else if other instanceof UnionType
        compare @types, other.types
      else
        "UnionType" <=> other.constructor.name
    
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
        not overlaps @types, other.untypes
      else
        other == any
    
    def overlaps(other as Type)
      if other instanceof SimpleType
        contains @types, other
      else if other instanceofsome [ArrayType, ObjectType, FunctionType]
        for some type in @types by -1
          other.overlaps type
      else if other instanceof UnionType
        overlaps @types, other.types
      else
        other.overlaps this
    
    def complement() -> ComplementType @types
    def inspect(depth)
      "(" & (for type in @types; inspect type, null, if depth? then depth - 1 else null).join(").union(") & ")"
    
    def to-JSON() -> { type: \union, @types }
    from-JSON-types.union := #({types})
      for reduce type in types by -1, current = Type.none
        current.union(Type.from-JSON(type))

  class ComplementType extends Type
    def constructor(untypes as [Type])@
      if untypes.length == 0
        throw Error "Must provide at least 1 untype to ComplementType"
      @untypes := untypes
    
    def to-string()
      @_name ?= if @untypes.length == 1
        "any \\ $(String @untypes[0])"
      else
        "any \\ ($(@untypes.join '|'))"
    
    def equals(other)
      if this == other
        true
      else if other instanceof ComplementType
        equals @untypes, other.untypes
      else
        false
    
    def compare(other)
      if this == other
        0
      else if other instanceof ComplementType
        compare @untypes, other.untypes
      else
        "ComplementType" <=> other.constructor.name
    
    def union(other as Type)
      if other instanceofsome [SimpleType, ArrayType, ObjectType, FunctionType]
        let untypes = relative-complement @untypes, [other]
        if untypes == @untypes
          this
        else
          make-complement-type untypes
      else if other instanceof UnionType
        let untypes = relative-complement @untypes, other.types
        if untypes == @untypes
          this
        else
          make-complement-type untypes
      else if other instanceof ComplementType
        let untypes = intersect @untypes, other.untypes
        if untypes == @untypes
          this
        else if untypes == other.untypes
          other
        else
          make-complement-type untypes
      else
        other.union this
    
    def intersect(other as Type)
      if other instanceofsome [SimpleType, ArrayType, ObjectType, FunctionType]
        if contains @untypes, other
          none
        else
          other
      else if other instanceof UnionType
        let types = relative-complement other.types, @untypes
        if types == other.types
          other
        else
          make-union-type types
      else if other instanceof ComplementType
        let untypes = union @untypes, other.untypes
        if untypes == @untypes
          this
        else if untypes == other.untypes
          other
        else
          make-complement-type untypes
      else
        other.intersect this
    
    def is-subset-of(other as Type)
      if other instanceof ComplementType
        is-subset-of other.untypes, @untypes
      else
        other == any
    
    def overlaps(other as Type)
      if other instanceof SimpleType
        not contains @untypes, other
      else if other instanceofsome [ArrayType, FunctionType]
        for every untype in @untypes by -1
          not other.overlaps untype
      else if other instanceof ObjectType
        for every untype in @untypes by -1
          if untype instanceof ObjectType
            not other.is-subset-of untype
          else
            true
      else if other instanceof UnionType
        relative-complement(other.types, @untypes).length > 0
      else if other instanceof ComplementType
        true
      else
        other.overlaps this
    
    def complement()
      let untypes = @untypes
      if untypes.length == 1
        untypes[0]
      else
        make-union-type untypes
    
    def inspect(depth)
      UnionType(@untypes).inspect(depth) & ".complement()"
    
    def to-JSON() -> { type: \complement, untype: @complement() }
    from-JSON-types.complement := #({untype}) -> Type.from-JSON(untype).complement()
  
  let any = @any := new class AnyType extends Type
    def constructor()@
      if any
        throw Error "Cannot instantiate more than once"
    
    def to-string() -> "any"
    
    def equals(other) -> this == other
    
    def compare(other)
      if this == other
        0
      else
        "AnyType" <=> other.constructor.name
    
    def union(other) -> this
    def intersect(other) -> other
    def is-subset-of(other) -> this == other
    def overlaps(other) -> true
    def complement() -> none
    def inspect() -> "Type.any"
    
    def to-JSON() -> { type: \any }
    from-JSON-types.any := #-> any
  
  let none = @none := new class NoneType extends Type
    def constructor()@
      if none
        throw Error "Cannot instantiate more than once"
    
    def to-string() -> "none"
    
    def equals(other) -> this == other
    
    def compare(other)
      if this == other
        0
      else
        "NoneType" <=> other.constructor.name
    
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
