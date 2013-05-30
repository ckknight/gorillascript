import 'shared.gs'

require! source-map: "source-map"
require! path

module.exports := class SourceMap
  def constructor(@source-map-file, @generated-file, source-root)
    @generator := new source-map.SourceMapGenerator {
      file: path.relative path.dirname(source-map-file), generated-file
      source-root
    }
    @source-files := []
  
  def get() -> @generator
  def to-string() -> @generator.to-string()
  def get-relative-path(source-file as String)
    path.relative path.dirname(@source-map-file), source-file
  def push-file(source-file as String)!
    @source-files.push @get-relative-path(source-file)
  def pop-file()!
    @source-files.pop()
  def add(generated-line, generated-column, source-line, source-column, source-file)!
    if source-file
      @push-file source-file
      @add generated-line, generated-column, source-line, source-column
      @pop-file()
    else if source-line > 0 and @source-files.length > 0
      @generator.add-mapping {
        generated: { line: generated-line, column: generated-column }
        original: { line: source-line, column: source-column }
        source: @source-files[* - 1]
      }
