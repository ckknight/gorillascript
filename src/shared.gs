const DEBUG = false
const DISABLE_TYPE_CHECKING = not DEBUG
const DISABLE_GENERICS = not DEBUG

const CURRENT_ARRAY_LENGTH_NAME = \__current-array-length

const ParserNodeType = {
  Access:          1
  AccessMulti:     2
  Array:           4
  Assign:          5
  Binary:          6
  Block:           7
  Break:           8
  Call:            9
  Cascade:        10
  Comment:        11
  Continue:       13
  Debugger:       14
  Def:            15
  EmbedWrite:     16
  Eval:           17
  For:            18
  ForIn:          19
  Function:       20
  Ident:          21
  If:             22
  MacroAccess:    23
  MacroConst:     24
  Nothing:        25
  Object:         26
  Param:          27
  Regexp:         28
  Return:         29
  Root:           30
  Spread:         31
  Super:          32
  Switch:         33
  SyntaxChoice:   34
  SyntaxMany:     35
  SyntaxParam:    36
  SyntaxSequence: 37
  This:           38
  Throw:          39
  Tmp:            40
  TmpWrapper:     41
  TryCatch:       42
  TryFinally:     43
  TypeFunction:   44
  TypeGeneric:    45
  TypeObject:     46
  TypeUnion:      47
  Unary:          48
  Var:            49
  Yield:          50
}
