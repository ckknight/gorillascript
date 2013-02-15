let string-repeat(text, count)
  if count < 1
    ""
  else if count == 1
    text
  else if count bitand 1
    text & string-repeat text, count - 1
  else
    string-repeat text & text, count / 2
exports.string-repeat := string-repeat

exports.pad-left := #(text, len, padding)
  string-repeat(padding, len - text.length) & text
exports.pad-right := #(text, len, padding)
  text & string-repeat(padding, len - text.length)
