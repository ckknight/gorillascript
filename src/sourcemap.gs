require! source-map: "source-map"

module.exports := class SourceMap
  def constructor(generated-file, source-root)
    @generator := new source-map.SourceMapGenerator { file: generated-file, source-root }
  
  def set-source(source-file)
    @source-file := source-file
  def get() -> @generator
  def to-string() -> @generator.to-string()
  def add(generated-line, generated-column, source-line, source-column)!
    if source-line == 0
      return
    if not @source-file
      throw Error "Must call set-source before calling add"
    @generator.add-mapping {
      generated: { line: generated-line, column: generated-column }
      original: { line: source-line, column: source-column }
      source: @source-file
    }
