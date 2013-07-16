(function () {
  "use strict";
  var __create, __import, __isArray, __owns, __slice, __toArray, __typeof,
      MacroHolder, Type;
  __create = typeof Object.create === "function" ? Object.create
    : function (x) {
      function F() {}
      F.prototype = x;
      return new F();
    };
  __import = function (dest, source) {
    var k;
    for (k in source) {
      if (__owns.call(source, k)) {
        dest[k] = source[k];
      }
    }
    return dest;
  };
  __isArray = typeof Array.isArray === "function" ? Array.isArray
    : (function (_toString) {
      return function (x) {
        return _toString.call(x) === "[object Array]";
      };
    }(Object.prototype.toString));
  __owns = Object.prototype.hasOwnProperty;
  __slice = Array.prototype.slice;
  __toArray = function (x) {
    if (x == null) {
      throw new TypeError("Expected an object, got " + __typeof(x));
    } else if (__isArray(x)) {
      return x;
    } else if (typeof x === "string") {
      return x.split("");
    } else if (typeof x.length === "number") {
      return __slice.call(x);
    } else {
      throw new TypeError("Expected an object with a length property, got " + __typeof(x));
    }
  };
  __typeof = (function () {
    var _toString;
    _toString = Object.prototype.toString;
    return function (o) {
      if (o === void 0) {
        return "Undefined";
      } else if (o === null) {
        return "Null";
      } else {
        return o.constructor && o.constructor.name || _toString.call(o).slice(8, -1);
      }
    };
  }());
  Type = require("./types");
  MacroHolder = (function () {
    var _MacroHolder_prototype;
    function MacroHolder(syntaxes, macroName, wordOrSymbol, oneOf, sequential) {
      var _this;
      _this = this instanceof MacroHolder ? this : __create(_MacroHolder_prototype);
      _this.syntaxes = syntaxes;
      _this.macroName = macroName;
      _this.wordOrSymbol = wordOrSymbol;
      _this.oneOf = oneOf;
      _this.sequential = sequential;
      _this.byName = {};
      _this.byId = [];
      _this.byLabel = {};
      _this.typeById = [];
      _this.operatorNames = {};
      _this.binaryOperators = [];
      _this.assignOperators = [];
      _this.prefixUnaryOperators = [];
      _this.postfixUnaryOperators = [];
      _this.consts = {};
      _this.serialization = {};
      _this.helpers = {};
      return _this;
    }
    _MacroHolder_prototype = MacroHolder.prototype;
    MacroHolder.displayName = "MacroHolder";
    _MacroHolder_prototype.clone = function () {
      var clone;
      clone = MacroHolder(
        this.syntaxes,
        this.macroName,
        this.wordOrSymbol,
        this.oneOf,
        this.sequential
      );
      clone.byName = __import({}, this.byName);
      clone.byId = this.byId.slice();
      clone.byLabel = __import({}, this.byLabel);
      clone.typeById = this.typeById.slice();
      clone.operatorNames = __import({}, this.operatorNames);
      clone.binaryOperators = this.binaryOperators.slice();
      clone.assignOperators = this.assignOperators.slice();
      clone.prefixUnaryOperators = this.prefixUnaryOperators.slice();
      clone.postfixUnaryOperators = this.postfixUnaryOperators.slice();
      clone.consts = __import({}, this.consts);
      clone.serialization = __import({}, this.serialization);
      clone.helpers = __import({}, this.helpers);
      clone.syntaxes = __import({}, this.syntaxes);
      return clone;
    };
    _MacroHolder_prototype.getByName = function (name) {
      var _ref;
      if (__owns.call(_ref = this.byName, name)) {
        return _ref[name];
      }
    };
    _MacroHolder_prototype.getOrAddByName = function (name) {
      var byName, m, token;
      byName = this.byName;
      if (__owns.call(byName, name)) {
        return byName[name];
      } else {
        token = this.macroName(name);
        m = function (parser, index) {
          var _arr, _i, _ref, item;
          for (_arr = __toArray(m.data), _i = _arr.length; _i--; ) {
            item = _arr[_i];
            if (_ref = item(parser, index)) {
              return _ref;
            }
          }
        };
        m.token = token;
        m.data = [];
        return byName[name] = m;
      }
    };
    _MacroHolder_prototype.getOrAddByNames = function (names) {
      var _arr, _i, _len, name;
      _arr = [];
      for (_i = 0, _len = names.length; _i < _len; ++_i) {
        name = names[_i];
        _arr.push(this.getOrAddByName(name));
      }
      return _arr;
    };
    _MacroHolder_prototype.setTypeById = function (id, type) {
      this.typeById[id] = type;
    };
    _MacroHolder_prototype.getTypeById = function (id) {
      return this.typeById[id];
    };
    _MacroHolder_prototype.getById = function (id) {
      var byId;
      byId = this.byId;
      if (id >= 0 && id < byId.length) {
        return byId[id];
      }
    };
    _MacroHolder_prototype.addMacro = function (m, macroId, type) {
      var byId;
      if (macroId == null) {
        macroId = void 0;
      }
      if (type == null) {
        type = void 0;
      }
      byId = this.byId;
      if (macroId != null) {
        if (__owns.call(byId, macroId)) {
          throw new Error("Cannot add macro #" + macroId + ", as it already exists");
        }
        byId[macroId] = m;
      } else {
        byId.push(m);
        macroId = byId.length - 1;
      }
      if (type != null) {
        this.typeById[macroId] = type;
      }
      return macroId;
    };
    _MacroHolder_prototype.replaceMacro = function (id, m, type) {
      var byId;
      if (type == null) {
        type = void 0;
      }
      byId = this.byId;
      byId[id] = m;
      if (type != null) {
        this.typeById[id] = type;
      }
    };
    _MacroHolder_prototype.hasMacroOrOperator = function (name) {
      return __owns.call(this.byName, name) || __owns.call(this.operatorNames, name);
    };
    _MacroHolder_prototype.getMacroAndOperatorNames = function () {
      var _obj, name, names;
      names = [];
      _obj = this.byName;
      for (name in _obj) {
        if (__owns.call(_obj, name)) {
          names.push(name);
        }
      }
      _obj = this.operatorNames;
      for (name in _obj) {
        if (__owns.call(_obj, name)) {
          names.push(name);
        }
      }
      return names;
    };
    _MacroHolder_prototype.allBinaryOperators = function () {
      var _arr, _i, _len, _ref, array, result;
      if ((_ref = this._allBinaryOperators) == null) {
        result = [];
        for (_arr = __toArray(this.binaryOperators), _i = 0, _len = _arr.length; _i < _len; ++_i) {
          array = _arr[_i];
          result.push.apply(result, __toArray(array));
        }
        return this._allBinaryOperators = result;
      } else {
        return _ref;
      }
    };
    _MacroHolder_prototype.addBinaryOperator = function (operators, m, options, macroId) {
      var _arr, _i, _ref, _this, binaryOperators, data, i, op, precedence;
      _this = this;
      for (_arr = __toArray(operators), _i = _arr.length; _i--; ) {
        op = _arr[_i];
        this.operatorNames[op] = true;
      }
      precedence = Number(options.precedence) || 0;
      for (i = +this.binaryOperators.length; i <= precedence; ++i) {
        this.binaryOperators[i] = [];
      }
      binaryOperators = this.binaryOperators[precedence];
      data = {
        rule: this.oneOf.apply(this, (function () {
          var _arr, _arr2, _i, _len, op;
          _arr = [];
          for (_arr2 = __toArray(operators), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
            op = _arr2[_i];
            _arr.push(_this.wordOrSymbol(op));
          }
          return _arr;
        }())),
        func: m,
        rightToLeft: !!options.rightToLeft,
        maximum: options.maximum || 0,
        minimum: options.minimum || 0,
        invertible: !!options.invertible
      };
      binaryOperators.push(data);
      this._allBinaryOperators = null;
      if (options.label) {
        this.addByLabel(options.label, data);
      }
      return this.addMacro(m, macroId, (_ref = options.type) === "left" || _ref === "right" ? options.type
        : options.type != null && __owns.call(Type, _ref = options.type) ? Type[_ref]
        : void 0);
    };
    _MacroHolder_prototype.getByLabel = function (label) {
      var _ref;
      if (__owns.call(_ref = this.byLabel, label)) {
        return _ref[label];
      }
    };
    _MacroHolder_prototype.addByLabel = function (label, data) {
      return this.byLabel[label] = data;
    };
    _MacroHolder_prototype.addAssignOperator = function (operators, m, options, macroId) {
      var _arr, _i, _ref, _this, data, op;
      _this = this;
      for (_arr = __toArray(operators), _i = _arr.length; _i--; ) {
        op = _arr[_i];
        this.operatorNames[op] = true;
      }
      data = {
        rule: this.oneOf.apply(this, (function () {
          var _arr, _arr2, _i, _len, op;
          _arr = [];
          for (_arr2 = __toArray(operators), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
            op = _arr2[_i];
            if (op === ":=") {
              _arr.push(_this.syntaxes.ColonEqual);
            } else {
              _arr.push(_this.wordOrSymbol(op));
            }
          }
          return _arr;
        }())),
        func: m
      };
      this.assignOperators.push(data);
      if (options.label) {
        this.addByLabel(options.label, data);
      }
      return this.addMacro(m, macroId, (_ref = options.type) === "left" || _ref === "right" ? options.type
        : options.type != null && __owns.call(Type, _ref = options.type) ? Type[_ref]
        : void 0);
    };
    _MacroHolder_prototype.addUnaryOperator = function (operators, m, options, macroId) {
      var _arr, _i, _ref, _this, data, op, store;
      _this = this;
      for (_arr = __toArray(operators), _i = _arr.length; _i--; ) {
        op = _arr[_i];
        this.operatorNames[op] = true;
      }
      if (options.postfix) {
        store = this.postfixUnaryOperators;
      } else {
        store = this.prefixUnaryOperators;
      }
      data = {
        rule: this.oneOf.apply(this, (function () {
          var _arr, _arr2, _i, _len, op, rule;
          _arr = [];
          for (_arr2 = __toArray(operators), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
            op = _arr2[_i];
            rule = _this.wordOrSymbol(op);
            if (!/[a-zA-Z]/.test(op)) {
              if (options.postfix) {
                _arr.push(_this.sequential(_this.syntaxes.NoSpace, ["this", rule]));
              } else {
                _arr.push(_this.sequential(
                  ["this", rule],
                  _this.syntaxes.NoSpace
                ));
              }
            } else {
              _arr.push(rule);
            }
          }
          return _arr;
        }())),
        func: m,
        standalone: __owns.call(!options, "standalone") || !!options.standalone
      };
      store.push(data);
      if (options.label) {
        this.addByLabel(options.label, data);
      }
      return this.addMacro(m, macroId, options.type === "node" ? options.type
        : options.type != null && __owns.call(Type, _ref = options.type) ? Type[_ref]
        : void 0);
    };
    _MacroHolder_prototype.addSerializedHelper = function (name, helper, type, dependencies) {
      var _ref, _ref2, helpers;
      if ((_ref = (_ref2 = this.serialization).helpers) != null) {
        helpers = _ref;
      } else {
        helpers = _ref2.helpers = {};
      }
      helpers[name] = { helper: helper, type: type, dependencies: dependencies };
    };
    _MacroHolder_prototype.addConst = function (name, value) {
      this.consts[name] = value;
    };
    _MacroHolder_prototype.addSerializedConst = function (name) {
      var _ref, _ref2, consts;
      if (!__owns.call(this.consts, name)) {
        throw new Error("Unknown const " + name);
      }
      if ((_ref = (_ref2 = this.serialization).consts) != null) {
        consts = _ref;
      } else {
        consts = _ref2.consts = {};
      }
      consts[name] = this.consts[name];
    };
    _MacroHolder_prototype.addMacroSerialization = function (serialization) {
      var _ref, _ref2, _ref3, byType, obj;
      obj = __import({}, serialization);
      delete obj.type;
      if ((_ref = (_ref2 = this.serialization)[_ref3 = serialization.type]) != null) {
        byType = _ref;
      } else {
        byType = _ref2[_ref3] = [];
      }
      byType.push(obj);
    };
    _MacroHolder_prototype.addSyntax = function (name, value) {
      if (__owns.call(this.syntaxes, name)) {
        throw new Error("Cannot override already-defined syntax: " + name);
      }
      this.syntaxes[name] = value;
    };
    _MacroHolder_prototype.hasSyntax = function (name) {
      return __owns.call(this.syntaxes, name);
    };
    _MacroHolder_prototype.getSyntax = function (name) {
      if (__owns.call(this.syntaxes, name)) {
        return this.syntaxes[name];
      } else {
        throw new Error("Unknown syntax: " + name);
      }
    };
    _MacroHolder_prototype.serialize = function () {
      var _arr, _this, ast, dep, helper, helpers, i, name, noPos, serialization,
          serializedAssignOperators, serializedBinaryOperators, serializedCall,
          serializedDefineSyntax, serializedHelpers, serializedSyntax,
          serializedUnaryOperators;
      _this = this;
      serialization = __import({}, this.serialization);
      helpers = __owns.call(serialization, "helpers") && serialization.helpers || {};
      for (name in helpers) {
        if (__owns.call(helpers, name)) {
          helper = helpers[name];
          for (_arr = __toArray(helper.dependencies), i = _arr.length; i--; ) {
            dep = _arr[i];
            if (!__owns.call(helpers, dep) || dep === name) {
              helper.dependencies.splice(i, 1);
            }
          }
        }
      }
      function asJson(x) {
        if (x === void 0) {
          return x;
        } else {
          return JSON.parse(JSON.stringify(x));
        }
      }
      function toJS(x) {
        return require("./jsutils").toJSSource(x, null, { indent: 2 });
      }
      noPos = { line: 0, column: 0 };
      ast = require("./jsast");
      function unwrapFunc(code) {
        code = code.replace(/^return\s*([\s\S]*);\s*$/, "$1");
        code = code.replace(/^\s*\(function\s*\(\s*\)\s*{\s*"use strict";\s*return\s*function([\s\S]*)\};\s*\}\.call\(this\)\)\s*$/, "function$1}");
        code = code.replace(/^\s*\(function\s*\(\s*\)\s*{\s*"use strict";\s*([\s\S]*)\};\s*\}\.call\(this\)\)\s*$/, "function() {\n  $1\n  }\n}.call(this)");
        return code = code.split("\n").join("\n      ");
      }
      serializedHelpers = ast.Obj(noPos, (function () {
        var _arr, helper, name;
        _arr = [];
        for (name in helpers) {
          if (__owns.call(helpers, name)) {
            helper = helpers[name];
            _arr.push(ast.Obj.Pair(noPos, name, ast.Obj(noPos, [
              ast.Obj.Pair(noPos, "helper", helper.helper.toAst(noPos, ast.Ident(noPos, "AST$"))),
              ast.Obj.Pair(noPos, "type", helper.type.toAst(ast, noPos, ast.Ident(noPos, "TYPE$"))),
              ast.Obj.Pair(noPos, "dependencies", ast.fromLiteral(noPos, asJson(helper.dependencies)))
            ])));
          }
        }
        return _arr;
      }())).toString({ indent: 2 });
      serializedBinaryOperators = ast.Arr(noPos, (function () {
        var _arr, _arr2, _i, _len, _ref, code, id, operators, options;
        _arr = [];
        for (_arr2 = __toArray(serialization.binaryOperator), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
          _ref = _arr2[_i];
          code = _ref.code;
          operators = _ref.operators;
          options = _ref.options;
          id = _ref.id;
          _ref = null;
          _arr.push(ast.Obj(noPos, [
            ast.Obj.Pair(noPos, "code", ast.Eval(noPos, unwrapFunc(code))),
            ast.Obj.Pair(noPos, "operators", ast.fromLiteral(noPos, operators)),
            ast.Obj.Pair(noPos, "options", ast.fromLiteral(noPos, options)),
            ast.Obj.Pair(noPos, "id", ast.fromLiteral(noPos, id))
          ]));
        }
        return _arr;
      }())).toString({ indent: 2 });
      serializedAssignOperators = ast.Arr(noPos, (function () {
        var _arr, _arr2, _i, _len, _ref, code, id, operators, options;
        _arr = [];
        for (_arr2 = __toArray(serialization.assignOperator), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
          _ref = _arr2[_i];
          code = _ref.code;
          operators = _ref.operators;
          options = _ref.options;
          id = _ref.id;
          _ref = null;
          _arr.push(ast.Obj(noPos, [
            ast.Obj.Pair(noPos, "code", ast.Eval(noPos, unwrapFunc(code))),
            ast.Obj.Pair(noPos, "operators", ast.fromLiteral(noPos, operators)),
            ast.Obj.Pair(noPos, "options", ast.fromLiteral(noPos, options)),
            ast.Obj.Pair(noPos, "id", ast.fromLiteral(noPos, id))
          ]));
        }
        return _arr;
      }())).toString({ indent: 2 });
      serializedUnaryOperators = ast.Arr(noPos, (function () {
        var _arr, _arr2, _i, _len, _ref, code, id, operators, options;
        _arr = [];
        for (_arr2 = __toArray(serialization.unaryOperator), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
          _ref = _arr2[_i];
          code = _ref.code;
          operators = _ref.operators;
          options = _ref.options;
          id = _ref.id;
          _ref = null;
          _arr.push(ast.Obj(noPos, [
            ast.Obj.Pair(noPos, "code", ast.Eval(noPos, unwrapFunc(code))),
            ast.Obj.Pair(noPos, "operators", ast.fromLiteral(noPos, operators)),
            ast.Obj.Pair(noPos, "options", ast.fromLiteral(noPos, options)),
            ast.Obj.Pair(noPos, "id", ast.fromLiteral(noPos, id))
          ]));
        }
        return _arr;
      }())).toString({ indent: 2 });
      serializedDefineSyntax = ast.Arr(noPos, (function () {
        var _arr, _arr2, _i, _len, _ref, code, id, options, params;
        _arr = [];
        for (_arr2 = __toArray(serialization.defineSyntax), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
          _ref = _arr2[_i];
          code = _ref.code;
          options = _ref.options;
          params = _ref.params;
          id = _ref.id;
          _ref = null;
          _arr.push(ast.Obj(noPos, [
            ast.Obj.Pair(noPos, "code", code && ast.Eval(noPos, unwrapFunc(code))),
            ast.Obj.Pair(noPos, "options", ast.fromLiteral(noPos, options)),
            ast.Obj.Pair(noPos, "params", ast.fromLiteral(noPos, asJson(params))),
            ast.Obj.Pair(noPos, "id", ast.fromLiteral(noPos, id))
          ]));
        }
        return _arr;
      }())).toString({ indent: 2 });
      serializedSyntax = ast.Arr(noPos, (function () {
        var _arr, _arr2, _i, _len, _ref, code, id, names, options, params;
        _arr = [];
        for (_arr2 = __toArray(serialization.syntax), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
          _ref = _arr2[_i];
          code = _ref.code;
          options = _ref.options;
          params = _ref.params;
          names = _ref.names;
          id = _ref.id;
          _ref = null;
          _arr.push(ast.Obj(noPos, [
            ast.Obj.Pair(noPos, "code", code && ast.Eval(noPos, unwrapFunc(code))),
            ast.Obj.Pair(noPos, "options", ast.fromLiteral(noPos, options)),
            ast.Obj.Pair(noPos, "params", ast.fromLiteral(noPos, asJson(params))),
            ast.Obj.Pair(noPos, "names", ast.fromLiteral(noPos, names)),
            ast.Obj.Pair(noPos, "id", ast.fromLiteral(noPos, id))
          ]));
        }
        return _arr;
      }())).toString({ indent: 2 });
      serializedCall = ast.Arr(noPos, (function () {
        var _arr, _arr2, _i, _len, _ref, code, id, names, options;
        _arr = [];
        for (_arr2 = __toArray(serialization.call), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
          _ref = _arr2[_i];
          code = _ref.code;
          options = _ref.options;
          names = _ref.names;
          id = _ref.id;
          _ref = null;
          _arr.push(ast.Obj(noPos, [
            ast.Obj.Pair(noPos, "code", code && ast.Eval(noPos, unwrapFunc(code))),
            ast.Obj.Pair(noPos, "options", ast.fromLiteral(noPos, options)),
            ast.Obj.Pair(noPos, "names", ast.fromLiteral(noPos, names)),
            ast.Obj.Pair(noPos, "id", ast.fromLiteral(noPos, id))
          ]));
        }
        return _arr;
      }())).toString({ indent: 2 });
      return "function (TYPE$, AST$) {\n  return {\n    consts: " + toJS(serialization.consts) + ",\n    helpers: " + serializedHelpers + ",\n    binaryOperator: " + serializedBinaryOperators + ",\n    assignOperator: " + serializedAssignOperators + ",\n    unaryOperator: " + serializedUnaryOperators + ",\n    defineSyntax: " + serializedDefineSyntax + ",\n    syntax: " + serializedSyntax + ",\n    call: " + serializedCall + "\n  };\n}";
    };
    _MacroHolder_prototype.deserialize = function (getData, state) {
      var _obj, _ref, ast, data, dependencies, helper, name, type, value;
      ast = require("./jsast");
      data = getData(Type, ast.byTypeId);
      _obj = (_ref = __owns.call(data, "helpers") ? data.helpers : void 0) != null ? _ref : {};
      for (name in _obj) {
        if (__owns.call(_obj, name)) {
          _ref = _obj[name];
          helper = _ref.helper;
          type = _ref.type;
          dependencies = _ref.dependencies;
          _ref = null;
          if (!(helper instanceof ast.Node)) {
            throw new Error("bad helper ast in helper " + name);
          }
          if (!(type instanceof Type)) {
            throw new Error("bad type in helper " + name);
          }
          this.addHelper(name, helper, type, dependencies);
        }
      }
      _obj = (_ref = __owns.call(data, "consts") ? data.consts : void 0) != null ? _ref : {};
      for (name in _obj) {
        if (__owns.call(_obj, name)) {
          value = _obj[name];
          this.addConst(name, value);
        }
      }
      state.deserializeMacros(data);
    };
    _MacroHolder_prototype.addHelper = function (name, value, type, dependencies) {
      if (__owns.call(this.helpers, name)) {
        throw new Error("Trying to overwrite helper " + name);
      }
      return this.helpers[name] = { value: value, type: type, dependencies: dependencies };
    };
    _MacroHolder_prototype.hasHelper = function (name) {
      return __owns.call(this.helpers, name);
    };
    _MacroHolder_prototype.getHelper = function (name) {
      if (__owns.call(this.helpers, name)) {
        return this.helpers[name].value;
      } else {
        throw new Error("No such helper: " + name);
      }
    };
    _MacroHolder_prototype.helperType = function (name) {
      if (__owns.call(this.helpers, name)) {
        return this.helpers[name].type;
      } else {
        throw new Error("No such helper: " + name);
      }
    };
    _MacroHolder_prototype.helperDependencies = function (name) {
      if (__owns.call(this.helpers, name)) {
        return this.helpers[name].dependencies;
      } else {
        throw new Error("No such helper: " + name);
      }
    };
    return MacroHolder;
  }());
  module.exports = MacroHolder;
}.call(this));
