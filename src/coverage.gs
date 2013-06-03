require! ast: './jsast'

module.exports := #(root, sources, coverage-name = \_$jscoverage)
  let done-lines-by-file = { extends null }
  let walker(node, parent, position)
    let pos = node.pos
    let {file, line} = pos
    if file and sources[file] and line > 0
      let done-lines = done-lines-by-file[file] ?= []
      if not done-lines[line]
        switch
        // don't annotate lvalues
        case parent instanceof ast.Func and position in [\param, \name]; void
        case parent instanceof ast.TryCatch and position == \catch-ident; void
        case parent instanceof ast.ForIn and position == \key; void
        case parent instanceof ast.Binary and parent.is-assign() and position == \left; void
        case parent instanceof ast.Unary and parent.is-assign(); void
        // we care about the case bodies, not the case nodes
        case parent instanceof ast.Switch and position == \case-node; node
        // if a test shares the same line as its when-true, let the when-true take the line
        case parent instanceofsome [ast.IfStatement, ast.IfExpression] and position == \test and line == parent.when-true.pos.line; void
        case node instanceofsome [ast.IfStatement, ast.IfExpression] and line == node.when-true.pos.line
          ast.If pos,
            node.test
            walker(node.when-true, node, \when-false) ? node.when-true.walk walker
            walker(node.when-false, node, \when-false) ? node.when-false.walk walker
            node.label
        // we don't want to turn a method call into an indirect function call
        case node instanceof ast.Binary and node.op == "." and parent instanceof ast.Call and position == \func; void
        // obviously don't care about noops
        case node instanceof ast.Noop; void
        // if it's a return or throw, we care about its node rather than itself
        case node instanceofsome [ast.Return, ast.Throw]; void
        // if a function's body shares the same line, we care about the body, not the function declaration.
        case node instanceof ast.Func and node.body.pos.line == line; void
        // in the case of let x() y or def x() y, we care about the function, not the assignment
        case node instanceof ast.Binary and node.is-assign() and node.right instanceof ast.Func and node.right.pos.line == line
          ast.Binary pos,
            node.left
            node.op
            walker(node.right, node, \right) ? node.right.walk walker
        default
          done-lines[line] := true
          ast.Block pos, [
            ast.Unary pos, "++", ast.Access pos,
              ast.Ident pos, coverage-name
              ast.Const pos, file
              ast.Const pos, line
            node.walk walker
          ]
  let walked = root.walk walker
  let pos = root.pos
  ast.Root pos, ast.Block(pos, [
    ast.TryCatch pos,
      ast.If pos,
        ast.And pos,
          ast.Binary pos,
            ast.Unary pos, \typeof, ast.Ident pos, \top
            "==="
            ast.Const pos, \object
          ast.Binary pos,
            ast.Ident pos, \top
            "!=="
            ast.Const pos, null
          ast.Binary pos,
            ast.Unary pos, \typeof, ast.Access pos,
              ast.Ident pos, \top
              ast.Const pos, \opener
            "==="
            ast.Const pos, \object
          ast.Binary pos,
            ast.Access pos,
              ast.Ident pos, \top
              ast.Const pos, \opener
            "!=="
            ast.Const pos, null
          ast.Unary pos, "!", ast.Access pos,
            ast.Ident pos, \top
            ast.Const pos, \opener
            ast.Const pos, coverage-name
        ast.Assign pos,
          ast.Access pos,
            ast.Ident pos, \top
            ast.Const pos, \opener
            ast.Const pos, coverage-name
          ast.Obj pos
      ast.Ident pos, \e
      ast.Noop pos
    
    ast.TryCatch pos,
      ast.If pos,
        ast.And pos,
          ast.Binary pos,
            ast.Unary pos, \typeof, ast.Ident pos, \top
            "==="
            ast.Const pos, \object
          ast.Binary pos,
            ast.Ident pos, \top
            "!=="
            ast.Const pos, null
        ast.Block pos, [
          ast.TryCatch pos,
            ast.If pos,
              ast.And pos,
                ast.Binary pos,
                  ast.Unary pos, \typeof, ast.Access pos,
                    ast.Ident pos, \top
                    ast.Const pos, \opener
                  "==="
                  ast.Const pos, \object
                ast.Binary pos,
                  ast.Access pos,
                    ast.Ident pos, \top
                    ast.Const pos, \opener
                  "!=="
                  ast.Const pos, null
                ast.Access pos,
                  ast.Ident pos, \top
                  ast.Const pos, \opener
                  ast.Const pos, coverage-name
              ast.Assign pos,
                ast.Access pos,
                  ast.Ident pos, \top
                  ast.Const pos, coverage-name
                ast.Access pos,
                  ast.Ident pos, \top
                  ast.Const pos, \opener
                  ast.Const pos, coverage-name
            ast.Ident pos, \e
            ast.Noop pos
          ast.If pos,
            ast.Unary pos, "!", ast.Access pos,
              ast.Ident pos, \top
              ast.Const pos, coverage-name
            ast.Assign pos,
              ast.Access pos,
                ast.Ident pos, \top
                ast.Const pos, coverage-name
              ast.Obj pos
        ]
      ast.Ident pos, \e
      ast.Noop pos
    
    ast.TryCatch pos,
      ast.If pos,
        ast.And pos,
          ast.Binary pos,
            ast.Unary pos, \typeof, ast.Ident pos, \top
            "==="
            ast.Const pos, \object
          ast.Binary pos,
            ast.Ident pos, \top
            "!=="
            ast.Const pos, null
          ast.Access pos,
            ast.Ident pos, \top
            ast.Const pos, coverage-name
      ast.Ident pos, \e
      ast.Noop pos
    
    ast.If pos,
      ast.Binary pos,
        ast.Unary pos, \typeof, ast.Ident pos, coverage-name
        "!=="
        ast.Const pos, \object
      ast.Assign pos,
        ast.Ident pos, coverage-name
        ast.Obj pos
    
    ...(for file, lines of done-lines-by-file
      let line-numbers = []
      for line, i in lines
        if line
          line-numbers.push i
      ast.If pos,
        ast.Unary pos, "!", ast.Access pos,
          ast.Ident pos, coverage-name
          ast.Const pos, file
        ast.Call pos, ast.Func pos,
          null
          []
          [\cov, \i, \lines]
          ast.Block pos, [
            ast.Assign pos,
              ast.Access pos,
                ast.Ident pos, coverage-name
                ast.Const pos, file
              ast.Ident pos, \cov
              ast.Arr pos, []
            ast.For pos,
              ast.Block pos, [
                ast.Assign pos,
                  ast.Ident pos, \i
                  ast.Const pos, 0
                ast.Assign pos,
                  ast.Ident pos, \lines
                  ast.Arr pos, for line in line-numbers
                    ast.Const pos, line
              ]
              ast.Binary pos,
                ast.Ident pos, \i
                "<"
                ast.Const pos, line-numbers.length
              ast.Unary pos, "++", ast.Ident pos, \i
              ast.Assign pos,
                ast.Access pos,
                  ast.Ident pos, \cov
                  ast.Access pos,
                    ast.Ident pos, \lines
                    ast.Ident pos, \i
                ast.Const pos, 0
            ast.Assign pos,
              ast.Access pos,
                ast.Ident pos, \cov
                ast.Const pos, \source
              ast.Arr pos,
                for line in sources[file].split r"(?:\r\n?|[\n\u2028\u2029])"g
                  ast.Const pos, line
          ])
    walked.body
  ]), walked.variables, walked.declarations


/*
JSCoverage 0.5.1 writes out a prelude that looks something like this:  

    try {
      if (typeof top === 'object' && top !== null && typeof top.opener === 'object' && top.opener !== null) {
        // this is a browser window that was opened from another window

        if (! top.opener._$jscoverage) {
          top.opener._$jscoverage = {};
        }
      }
    }
    catch (e) {}

    try {
      if (typeof top === 'object' && top !== null) {
        // this is a browser window

        try {
          if (typeof top.opener === 'object' && top.opener !== null && top.opener._$jscoverage) {
            top._$jscoverage = top.opener._$jscoverage;
          }
        }
        catch (e) {}

        if (! top._$jscoverage) {
          top._$jscoverage = {};
        }
      }
    }
    catch (e) {}

    try {
      if (typeof top === 'object' && top !== null && top._$jscoverage) {
        _$jscoverage = top._$jscoverage;
      }
    }
    catch (e) {}
    if (typeof _$jscoverage !== 'object') {
      _$jscoverage = {};
    }
    if (! _$jscoverage['collection.js']) {
      _$jscoverage['collection.js'] = [];
      _$jscoverage['collection.js'][1] = 0;
      _$jscoverage['collection.js'][2] = 0;
      _$jscoverage['collection.js'][5] = 0;
      _$jscoverage['collection.js'][9] = 0;
      _$jscoverage['collection.js'][14] = 0;
      _$jscoverage['collection.js'][15] = 0;
      _$jscoverage['collection.js'][16] = 0;
      _$jscoverage['collection.js'][22] = 0;
      _$jscoverage['collection.js'][27] = 0;
    }
    
*/
