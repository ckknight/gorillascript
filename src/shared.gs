const DEBUG = false
const DISABLE_TYPE_CHECKING = not DEBUG
const DISABLE_GENERICS = not DEBUG

const CURRENT_ARRAY_LENGTH_NAME = \__current-array-length

const ParserNodeType = {
  Function:       20
  MacroAccess:    23
  Param:          27
}

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
