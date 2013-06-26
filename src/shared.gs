const DEBUG = false
const DISABLE_TYPE_CHECKING = not DEBUG
const DISABLE_GENERICS = not DEBUG

const CURRENT_ARRAY_LENGTH_NAME = \__current-array-length

macro cache-get-or-add!(cache, key, value)
  @maybe-cache cache, #(set-cache, cache)
    @maybe-cache key, #(set-key, key)
      let tmp = @macro-expand-1 @tmp \value
      AST
        let mutable $tmp = $set-cache.get($set-key)
        if $tmp == void
          $tmp := $value
          $cache.set($key, $tmp)
        $tmp


const ParserNodeTypeId = {
  Value:       0
  Symbol:      1
  Call:        2
  MacroAccess: 3
}

const ParserNodeSymbolTypeId = {
  Internal: 0
  Ident:    1
  Tmp:      2
  Operator: 3
}

const ParserNodeOperatorTypeId = {
  Binary: 0
  Unary:  1
  Assign: 2
}

const ParserNodeInternalId = {
  Access:          0
  Array:           1
  AutoReturn:      2
  Block:           3
  Break:           4
  Comment:         5
  ContextCall:     6
  Continue:        7
  Custom:          8
  Debugger:        9
  EmbedWrite:     10
  For:            11
  ForIn:          12
  Function:       13
  If:             14
  Label:          15
  MacroConst:     16
  New:            17
  Nothing:        18
  Object:         19
  Param:          20
  Return:         21
  Root:           22
  Spread:         23
  Switch:         24
  Super:          25
  SyntaxChoice:   26
  SyntaxMany:     27
  SyntaxParam:    28
  SyntaxSequence: 29
  Throw:          30
  TmpWrapper:     31
  TryCatch:       32
  TryFinally:     33
  TypeGeneric:    34
  TypeObject:     35
  TypeUnion:      36
  Var:            37
  Yield:          38
}