module.exports := do
  let Type()!
    throw TypeError "Type should not be instantiated"
  
  let notImplemented(name)
    #-> throw Error "Not implemented: $(@constructor.name).$name"
  
  Type::isSubsetOf := notImplemented "isSubset"
  Type::isSupersetOf := #(other) -> other.isSubsetOf(this)
  Type::overlaps := notImplemented "overlaps"
  Type::compare := notImplemented "compare"
  Type::equals := notImplemented "equals"
  Type::union := notImplemented "union"
  Type::intersect := notImplemented "intersect"
  Type::complement := notImplemented "complement"
  Type::array := #-> @_array ?= new ArrayType(this)
  
  let contains(alpha, bravo)
    for item in alpha
      if item.equals(bravo)
        return true
    false
  
  let union(alpha, bravo)
    let result = []
    let alphaLen = alpha.length
    let bravoLen = bravo.length
    let mutable i = 0
    let mutable j = 0
    while i < alphaLen and j < bravoLen
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
    while i < alphaLen, i += 1
      result.push alpha[i]
    while j < bravoLen, j += 1
      result.push bravo[j]
    
    let resultLen = result.length
    if resultLen == alphaLen
      alpha
    else if resultLen == bravoLen
      bravo
    else
      result
  
  let intersect(alpha, bravo)
    let alphaLen = alpha.length
    let bravoLen = bravo.length
    
    let result = []
    
    let mutable i = 0
    let mutable j = 0
    while i < alphaLen and j < bravoLen
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
    
    let resultLen = result.length
    if resultLen == alphaLen
      alpha
    else if resultLen == bravoLen
      bravo
    else
      result
  
  let relativeComplement(alpha, bravo)
    let result = []
    let alphaLen = alpha.length
    let bravoLen = bravo.length
    let mutable i = 0
    let mutable j = 0
    while i < alphaLen and j < bravoLen
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
    while i < alphaLen, i += 1
      result.push alpha[i]
    if result.length == alphaLen
      alpha
    else
      result
  
  let isSubsetOf(alpha, bravo)
    let alphaLen = alpha.length
    let bravoLen = bravo.length
    if alphaLen > bravoLen
      false
    else  
      let mutable i = 0
      let mutable j = 0
      while j < bravoLen
        if alpha[i].equals(bravo[j])
          i += 1
          if i >= alphaLen
            return true
          j += 1
        else
          j += 1
      false
  
  let overlaps(alpha, bravo)
    let alphaLen = alpha.length
    let bravoLen = bravo.length
    let mutable i = 0
    let mutable j = 0
    while i < alphaLen and j < bravoLen
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
        for i = 0, len
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
        for i = 0, len
          unless alpha[i].equals(bravo[i])
            return false
        true
  
  let typeComparer(a, b) -> a.compare(b)
  
  let makeUnionType(types, needsSort)
    let len = types.length
    if len == 0
      Type.none
    else if len == 1
      types[0]
    else
      if needsSort
        types.sort typeComparer
      new UnionType(types)
  
  let makeComplementType(types)
    if types.length == 0
      Type.any
    else
      new ComplementType(types)
  
  let SimpleType = do
    let getId = do
      let mutable id = -1
      #
        id += 1
        id
    
    let SimpleType(@name as String)!
      if this not instanceof SimpleType
        throw TypeError("Must be instantiated with new")
      @id := getId()
    SimpleType.prototype := ^Type.prototype
    SimpleType::constructor := SimpleType
    
    SimpleType::toString := #-> @name
    
    SimpleType::equals := #(other) -> this == other
    
    SimpleType::compare := #(other)
      if this == other
        0
      else if other instanceof SimpleType
        @name <=> other.name or @id <=> other.id
      else
        "SimpleType" <=> other.constructor.name
    
    SimpleType::union := #(other)
      if other not instanceof Type
        throw TypeError("Expected other to be a Type, got $(typeof! other)")
      else if other instanceof SimpleType
        if this == other
          this
        else
          makeUnionType [this, other], true
      else
        other.union this
    
    SimpleType::intersect := #(other)
      if other not instanceof Type
        throw TypeError("Expected other to be a Type, got $(typeof! other)")
      else if other instanceof SimpleType
        if this == other
          this
        else
          Type.none
      else
        other.intersect this
    
    SimpleType::isSubsetOf := #(other)
      if other instanceof SimpleType
        this == other
      else if other instanceof UnionType
        for some type in other.types
          this == type
      else if other instanceof ComplementType
        for every type in other.untypes
          this != type
      else
        other == Type.any
    
    SimpleType::overlaps := #(other)
      if other instanceof SimpleType
        this == other
      else
        other.overlaps this
    
    SimpleType::complement := #
      new ComplementType [this]
    
    SimpleType
  Type.make := #(name) -> new SimpleType(name)
  
  let ArrayType = do
    let ArrayType(@subtype as Type)!
      if this not instanceof ArrayType
        throw TypeError("Must be instantiated with new")
    ArrayType.prototype := ^Type.prototype
    ArrayType::constructor := ArrayType

    ArrayType::toString := #-> @_name ?= "[$(@subtype.toString())]"

    ArrayType::equals := #(other)
      other == this or (other instanceof ArrayType and @subtype.equals(other.subtype))

    ArrayType::compare := #(other)
      if this == other
        0
      else if other instanceof ArrayType
        @subtype.compare(other.subtype)
      else
        "ArrayType" <=> other.constructor.name

    ArrayType::union := #(other)
      if other not instanceof Type
        throw TypeError("Expected other to be a Type, got $(typeof! other)")
      else if other instanceof ArrayType
        if @equals(other)
          this
        else
          if @subtype.isSubsetOf(other.subtype)
            other
          else if other.subtype.isSubsetOf(@subtype)
            this
          else
            makeUnionType [this, other], true
      else if other instanceof SimpleType
        makeUnionType [this, other], true
      else
        other.union this

    ArrayType::intersect := #(other)
      if other not instanceof Type
        throw TypeError("Expected other to be a Type, got $(typeof! other)")
      else if other instanceof ArrayType
        if @equals(other)
          this
        else
          if @subtype.isSubsetOf(other.subtype)
            this
          else if other.subtype.isSubsetOf(@subtype)
            other
          else
            Type.none.array()
      else if other instanceof SimpleType
        Type.none
      else
        other.intersect this

    ArrayType::isSubsetOf := #(other)
      if other instanceof ArrayType
        @subtype.isSubsetOf(other.subtype)
      else if other instanceof UnionType
        for some type in other.types
          @equals(type)
      else if other instanceof ComplementType
        for every type in other.untypes
          not @equals(type)
      else
        other == Type.any

    ArrayType::overlaps := #(other)
      if other instanceof ArrayType
        @subtype.overlaps(other.subtype)
      else if other instanceof SimpleType
        false
      else
        other.overlaps this

    ArrayType::complement := #
      new ComplementType [this]

    ArrayType
  
  let UnionType = do
    let UnionType(@types as [Type])!
      if this not instanceof UnionType
        throw TypeError "Must be instantiated with new"
      if types.length <= 1
        throw Error "Must provide at least 2 types to UnionType"
    UnionType.prototype := ^Type.prototype
    UnionType::constructor := UnionType
    
    UnionType::toString := #-> @_name ?= "($(@types.join '|'))"
    
    UnionType::equals := #(other)
      if other == this
        true
      else if other instanceof UnionType
        equals @types, other.types
      else
        false
    
    UnionType::compare := #(other)
      if other == this
        0
      else if other instanceof UnionType
        compare @types, other.types
      else
        "UnionType" <=> other.constructor.name
    
    UnionType::union := #(other)
      if other instanceofsome [SimpleType, ArrayType]
        let types = union @types, [other]
        if types == @types
          this
        else
          makeUnionType types
      else if other instanceof UnionType
        let types = union @types, other.types
        if types == @types
          this
        else if types == other.types
          other
        else
          makeUnionType types
      else
        other.union this
    
    UnionType::intersect := #(other)
      if other instanceofsome [SimpleType, ArrayType]
        makeUnionType intersect @types, [other]
      else if other instanceof UnionType
        let types = intersect @types, other.types
        if types == @types
          this
        else if types == other.types
          other
        else
          makeUnionType types
      else
        other.intersect this
    
    UnionType::isSubsetOf := #(other)
      if other instanceof UnionType
        isSubsetOf @types, other.types
      else if other instanceof ComplementType
        not overlaps @types, other.untypes
      else
        other == Type.any
    
    UnionType::overlaps := #(other)
      if other instanceofsome [SimpleType, ArrayType]
        contains @types, other
      else if other instanceof UnionType
        overlaps @types, other.types
      else
        other.overlaps this
    
    UnionType::complement := #-> new ComplementType @types
    
    UnionType
  
  let ComplementType = do
    let ComplementType(@untypes as [Type])!
      if this not instanceof ComplementType
        throw TypeError "Must be instantiated with new"
      else if untypes.length == 0
        throw Error "Must provide at least 1 untype to ComplementType"
    ComplementType.prototype := ^Type.prototype
    ComplementType::constructor := ComplementType
    
    ComplementType::toString := #
      @_name ?= if @untypes.length == 1
        "any \\ $(@untypes[0].toString())"
      else
        "any \\ ($(@untypes.join '|'))"
    
    ComplementType::equals := #(other)
      if this == other
        true
      else if other instanceof ComplementType
        equals @untypes, other.untypes
      else
        false
    
    ComplementType::compare := #(other)
      if this == other
        0
      else if other instanceof ComplementType
        compare @untypes, other.untypes
      else
        "ComplementType" <=> other.constructor.name
    
    ComplementType::union := #(other)
      if other instanceofsome [SimpleType, ArrayType]
        let untypes = relativeComplement @untypes, [other]
        if untypes == @untypes
          this
        else
          makeComplementType untypes
      else if other instanceof UnionType
        let untypes = relativeComplement @untypes, other.types
        if untypes == @untypes
          this
        else
          makeComplementType untypes
      else if other instanceof ComplementType
        let untypes = intersect @untypes, other.untypes
        if untypes == @untypes
          this
        else if untypes == other.untypes
          other
        else
          makeComplementType untypes
      else
        other.union this
    
    ComplementType::intersect := #(other)
      if other instanceofsome [SimpleType, ArrayType]
        if contains @untypes, other
          Type.none
        else
          other
      else if other instanceof UnionType
        let types = relativeComplement other.types, @untypes
        if types == other.types
          other
        else
          makeUnionType types
      else if other instanceof ComplementType
        let untypes = union @untypes, other.untypes
        if untypes == @untypes
          this
        else if untypes == other.untypes
          other
        else
          makeComplementType untypes
      else
        other.intersect this
    
    ComplementType::isSubsetOf := #(other)
      if other instanceof ComplementType
        isSubsetOf other.untypes, @untypes
      else
        other == Type.any
    
    ComplementType::overlaps := #(other)
      if other instanceofsome [SimpleType, ArrayType]
        not contains @untypes, other
      else if other instanceof UnionType
        relativeComplement(other.types, @untypes).length > 0
      else if other instanceof ComplementType
        true
      else
        other.overlaps this
    
    ComplementType::complement := #(other)
      let untypes = @untypes
      if untypes.length == 1
        untypes[0]
      else
        makeUnionType untypes
    
    ComplementType
  
  Type.any := do
    let AnyType()!
      if this not instanceof AnyType
        throw TypeError "Must be instantiated with new"
      if Type.any
        throw Error "Cannot instantiate more than once"
    AnyType.prototype := ^Type.prototype
    AnyType::constructor := AnyType
    
    AnyType::toString := #-> "any"
    
    AnyType::equals := #(other) -> this == other
    
    AnyType::compare := #(other)
      if this == other
        0
      else
        "AnyType" <=> other.constructor.name
    
    AnyType::union := #(other) -> this
    AnyType::intersect := #(other) -> other
    AnyType::isSubsetOf := #(other) -> this == other
    AnyType::overlaps := #(other) -> true
    AnyType::complement := #-> Type.none
    
    new AnyType()
  
  Type.none := do
    let NoneType()!
      if this not instanceof NoneType
        throw TypeError "Must be instantiated with new"
      if Type.none
        throw Error "Cannot instantiate more than once"
    NoneType.prototype := ^Type.prototype
    NoneType::constructor := NoneType
    
    NoneType::toString := #-> "none"
    
    NoneType::equals := #(other) -> this == other
    
    NoneType::compare := #(other)
      if this == other
        0
      else
        "NoneType" <=> other.constructor.name
    
    NoneType::union := #(other) -> other
    NoneType::intersect := #(other) -> this
    NoneType::isSubsetOf := #(other) -> true
    NoneType::overlaps := #(other) -> false
    NoneType::complement := #-> Type.any
    
    new NoneType()
  
  Type.undefined := new SimpleType "undefined"
  Type.null := new SimpleType "null"
  Type.boolean := new SimpleType "Boolean"
  Type.string := new SimpleType "String"
  Type.number := new SimpleType "Number"
  Type.array := Type.any.array()
  Type.args := new SimpleType "Arguments"
  Type.object := new SimpleType "Object"
  Type.function := new SimpleType "Function"
  Type.regexp := new SimpleType "RegExp"
  Type.stringOrNumber := Type.string.union(Type.number)
  Type.arrayLike := Type.array.union(Type.args)
  Type.undefinedOrNull := Type.undefined.union(Type.null)
  Type.notUndefinedOrNull := Type.undefinedOrNull.complement()
  Type.primitive := Type.undefinedOrNull.union(Type.boolean).union(Type.string).union(Type.number)
  Type.nonPrimitive := Type.primitive.complement()
  Type.alwaysFalsy := Type.undefinedOrNull
  Type.potentiallyTruthy := Type.alwaysFalsy.complement()
  Type.potentiallyFalsy := Type.alwaysFalsy.union(Type.number).union(Type.string).union(Type.boolean)
  Type.alwaysTruthy := Type.potentiallyFalsy.complement()
  
  Type
