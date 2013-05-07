test "macros", #
  eq "BOOM!", gorilla.eval('''
  macro boom:
  syntax "goes", "the", "dynamite":
  ASTE "BOOM!"
  end
  end
  boom goes the dynamite
  ''', noindent: true)
  