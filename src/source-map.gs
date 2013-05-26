require! source-map: "source-map"

module.exports := class SourceMap
  def constructor(@generated-file, source-root)
    @generator := new source-map.SourceMapGenerator { file: generated-file, source-root }
    @source-files := []
  
  def get() -> @generator
  def to-string() -> @generator.to-string()
  def push-file(source-file as String)!
    @source-files.push source-file
  def pop-file()!
    @source-files.pop()
  def add(generated-line, generated-column, source-line, source-column, source-file)!
    if source-file
      @push-file source-file
      @add generated-line, generated-column, source-line, source-column
      @pop-file()
    else if source-line != 0 and @source-files.length > 0
      @generator.add-mapping {
        generated: { line: generated-line, column: generated-column }
        original: { line: source-line, column: source-column }
        source: @source-files[* - 1]
      }
