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
    for item in alpha
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
        for some type in other.types
          this == type
      else if other instanceof ComplementType
        for every type in other.untypes
          this != type
      else
        other == any
    
    def overlaps(other as Type)
      if other instanceof SimpleType
        this == other
      else
        other.overlaps this
    
    def complement() -> ComplementType [this]
    
    def inspect() -> "SimpleType($(inspect @name))"
  @make := #(name) -> SimpleType(name)
  
  class ArrayType extends Type
    def constructor(subtype as Type)@
      @subtype := subtype
    
    def to-string() -> @_name ?= "[$(String @subtype)]"
    
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
        for some type in other.types
          @is-subset-of(type)
      else if other instanceof ComplementType
        for every type in other.untypes
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
    def inspect(depth) -> "$(inspect @subtype, null, depth).array()"
  
  class FunctionType extends Type
    def constructor(return-type as Type)@
      @return-type := return-type

    def to-string() -> @_name ?= "-> $(String @return-type)"

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
      else if other instanceofsome [SimpleType, ArrayType]
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
      else if other instanceofsome [SimpleType, ArrayType]
        none
      else
        other.intersect this

    def is-subset-of(other as Type)
      if other instanceof FunctionType
        @return-type.is-subset-of(other.return-type)
      else if other instanceof UnionType
        for some type in other.types
          @is-subset-of(type)
      else if other instanceof ComplementType
        for every type in other.untypes
          not @is-subset-of(type)
      else
        other == any

    def overlaps(other as Type)
      if other instanceof FunctionType
        @return-type.overlaps(other.return-type)
      else if other instanceofsome [SimpleType, ArrayType]
        false
      else
        other.overlaps this

    def complement() -> ComplementType [this]
    def inspect(depth) -> "$(inspect @subtype, null, depth).array()"
  
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
      if other instanceofsome [SimpleType, ArrayType, FunctionType]
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
      else if other instanceofsome [ArrayType, FunctionType]
        for some type in @types
          other.overlaps type
      else if other instanceof UnionType
        overlaps @types, other.types
      else
        other.overlaps this
    
    def complement() -> ComplementType @types
    def inspect(depth) -> "UnionType($(inspect @types, null, if depth? then depth - 1 else null))"
  
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
      if other instanceofsome [SimpleType, ArrayType, FunctionType]
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
      if other instanceofsome [SimpleType, ArrayType, FunctionType]
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
        for every untype in @untypes
          not other.overlaps untype
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
    
    def inspect(depth) -> "ComplementType($(inspect @types, null, if depth? then depth - 1 else null))"
  
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
    def inspect() -> "AnyType()"
  
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
    def inspect() -> "NoneType()"
  
  @undefined := @make "undefined"
  @null := @make "null"
  @boolean := @make "Boolean"
  @string := @make "String"
  @string-array := @string.array()
  @number := @make "Number"
  @number-array := @number.array()
  @array := any.array()
  @args := @make "Arguments"
  @object := @make "Object"
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
