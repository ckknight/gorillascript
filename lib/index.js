(function (GLOBAL) {
  "use strict";
  var __async, __fromPromise, __isArray, __num, __once, __slice, __strnum,
      __toArray, __typeof, setImmediate;
  __async = function (limit, length, hasResult, onValue, onComplete) {
    var broken, completed, index, result, slotsUsed, sync;
    if (typeof limit !== "number") {
      throw TypeError("Expected limit to be a Number, got " + __typeof(limit));
    }
    if (typeof length !== "number") {
      throw TypeError("Expected length to be a Number, got " + __typeof(length));
    }
    if (hasResult == null) {
      hasResult = false;
    } else if (typeof hasResult !== "boolean") {
      throw TypeError("Expected hasResult to be a Boolean, got " + __typeof(hasResult));
    }
    if (typeof onValue !== "function") {
      throw TypeError("Expected onValue to be a Function, got " + __typeof(onValue));
    }
    if (typeof onComplete !== "function") {
      throw TypeError("Expected onComplete to be a Function, got " + __typeof(onComplete));
    }
    if (hasResult) {
      result = [];
    } else {
      result = null;
    }
    if (length <= 0) {
      return onComplete(null, result);
    }
    if (limit < 1 || limit !== limit) {
      limit = 1/0;
    }
    broken = null;
    slotsUsed = 0;
    sync = false;
    completed = false;
    function onValueCallback(err, value) {
      if (completed) {
        return;
      }
      --slotsUsed;
      if (err != null && broken == null) {
        broken = err;
      }
      if (hasResult && broken == null && arguments.length > 1) {
        result.push(value);
      }
      if (!sync) {
        next();
      }
    }
    index = -1;
    function next() {
      while (!completed && broken == null && slotsUsed < limit && ++index < length) {
        ++slotsUsed;
        sync = true;
        onValue(index, __once(onValueCallback));
        sync = false;
      }
      if (!completed && (broken != null || slotsUsed === 0)) {
        completed = true;
        if (broken != null) {
          onComplete(broken);
        } else {
          onComplete(null, result);
        }
      }
    }
    next();
  };
  __fromPromise = function (promise) {
    if (typeof promise !== "object" || promise === null) {
      throw TypeError("Expected promise to be an Object, got " + __typeof(promise));
    } else if (typeof promise.then !== "function") {
      throw TypeError("Expected promise.then to be a Function, got " + __typeof(promise.then));
    }
    return function (callback) {
      promise.then(
        function (value) {
          return setImmediate(callback, null, value);
        },
        function (reason) {
          return setImmediate(callback, reason);
        }
      );
    };
  };
  __isArray = typeof Array.isArray === "function" ? Array.isArray
    : (function () {
      var _toString;
      _toString = Object.prototype.toString;
      return function (x) {
        return _toString.call(x) === "[object Array]";
      };
    }());
  __num = function (num) {
    if (typeof num !== "number") {
      throw TypeError("Expected a number, got " + __typeof(num));
    } else {
      return num;
    }
  };
  __once = (function () {
    function replacement() {
      throw Error("Attempted to call function more than once");
    }
    function doNothing() {}
    return function (func, silentFail) {
      if (typeof func !== "function") {
        throw TypeError("Expected func to be a Function, got " + __typeof(func));
      }
      if (silentFail == null) {
        silentFail = false;
      } else if (typeof silentFail !== "boolean") {
        throw TypeError("Expected silentFail to be a Boolean, got " + __typeof(silentFail));
      }
      return function () {
        var f;
        f = func;
        if (silentFail) {
          func = doNothing;
        } else {
          func = replacement;
        }
        return f.apply(this, arguments);
      };
    };
  }());
  __slice = Array.prototype.slice;
  __strnum = function (strnum) {
    var type;
    type = typeof strnum;
    if (type === "string") {
      return strnum;
    } else if (type === "number") {
      return String(strnum);
    } else {
      throw TypeError("Expected a string or number, got " + __typeof(strnum));
    }
  };
  __toArray = function (x) {
    if (x == null) {
      throw TypeError("Expected an object, got " + __typeof(x));
    } else if (__isArray(x)) {
      return x;
    } else if (typeof x === "string") {
      return x.split("");
    } else {
      return __slice.call(x);
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
  setImmediate = typeof GLOBAL.setImmediate === "function" ? GLOBAL.setImmediate
    : typeof process !== "undefined" && typeof process.nextTick === "function"
    ? (function () {
      var nextTick;
      nextTick = process.nextTick;
      return function (func) {
        var args;
        if (typeof func !== "function") {
          throw TypeError("Expected func to be a Function, got " + __typeof(func));
        }
        args = __slice.call(arguments, 1);
        if (args.length) {
          return nextTick(function () {
            func.apply(void 0, __toArray(args));
          });
        } else {
          return nextTick(func);
        }
      };
    }())
    : function (func) {
      var args;
      if (typeof func !== "function") {
        throw TypeError("Expected func to be a Function, got " + __typeof(func));
      }
      args = __slice.call(arguments, 1);
      if (args.length) {
        return setTimeout(
          function () {
            func.apply(void 0, __toArray(args));
          },
          0
        );
      } else {
        return setTimeout(func, 0);
      }
    };
  jQuery(function ($) {
    var handleTry, hasTouch, inToc, inTocLabel, lastCompile, sideBySide;
    $("#try-link").removeClass("hide");
    handleTry = (function () {
      var compiling, interval;
      compiling = false;
      function handle() {
        var _once, text;
        if (compiling) {
          handleTry();
          return;
        }
        text = $("#try-input").val();
        compiling = true;
        return __fromPromise(GorillaScript.compile(text))((_once = false, function (err, result) {
          if (_once) {
            throw Error("Attempted to call function more than once");
          } else {
            _once = true;
          }
          compiling = false;
          if (err) {
            $("#try-input-wrap").addClass("error");
            lastCompile = "// Error: " + String(err);
          } else {
            $("#try-input-wrap").removeClass("error");
            lastCompile = result.code;
          }
          return $("#try-output").val(lastCompile);
        }));
      }
      return function () {
        if (interval != null) {
          clearTimeout(interval);
        }
        return interval = setTimeout(handle, 250);
      };
    }());
    function handleRun() {
      if (lastCompile) {
        try {
          return Function(lastCompile)();
        } catch (e) {
          alert(String(e));
          return;
        }
      }
    }
    setInterval(
      (function () {
        var lastText;
        lastText = "";
        return function () {
          var text;
          text = $("#try-input").val();
          if (text !== lastText) {
            lastText = text;
            return handleTry();
          }
        };
      }()),
      17
    );
    function safe(func) {
      return function () {
        try {
          return func.apply(this, arguments);
        } catch (e) {
          setImmediate(function () {
            throw e;
          });
        }
        return false;
      };
    }
    $("a[href=#try]").click(safe(function () {
      var $try;
      handleTry();
      $try = $("#try");
      $try.slideToggle();
      $("#run-link").toggleClass("hide");
      return false;
    }));
    $("a[href=#run]").click(safe(function () {
      handleRun();
      return false;
    }));
    $("#irc-button").click(safe(function () {
      var url;
      url = $(this).data("url");
      $(this).replaceWith($("<iframe id='irc-iframe' src='" + __strnum(url) + "'></iframe>"));
      return false;
    }));
    hasTouch = "ontouchstart" in window;
    inTocLabel = false;
    inToc = false;
    function handleTocUnhover() {
      if (!inToc && !inTocLabel && !hasTouch) {
        return $("#toc").removeClass("hover");
      }
    }
    $("#toc").removeClass("hover");
    if (!hasTouch) {
      $("#toc-label").addClass("no-touch").bind("touchstart", safe(function () {
        hasTouch = true;
        $(this).removeClass("no-touch");
        return true;
      }));
      $("#toc-label").hover(
        safe(function () {
          if (hasTouch) {
            return;
          }
          inTocLabel = true;
          return $("#toc").addClass("hover");
        }),
        safe(function () {
          if (hasTouch) {
            return;
          }
          inTocLabel = false;
          return setTimeout(handleTocUnhover, 17);
        })
      );
      $("#toc").hover(
        safe(function () {
          if (hasTouch) {
            return;
          }
          inToc = true;
          return $("#toc").addClass("hover");
        }),
        safe(function () {
          if (hasTouch) {
            return;
          }
          inToc = false;
          return setTimeout(handleTocUnhover, 17);
        })
      );
    }
    $("#toc-label a").click(safe(function () {
      setImmediate(function () {
        $("#toc").toggleClass("hover");
        return setTimeout(handleTocUnhover, 17);
      });
      return false;
    }));
    sideBySide = (function () {
      var pending, working;
      pending = [];
      working = false;
      function flush() {
        var $jsCode, _once, _ref, gsCode;
        if (pending.length === 0 || working) {
          return;
        }
        working = true;
        _ref = pending.shift();
        gsCode = _ref.gsCode;
        $jsCode = _ref.$jsCode;
        return __fromPromise(GorillaScript.compile(gsCode, { "return": true, bare: true }))((_once = false, function (err, result) {
          var $code, _once2;
          if (_once) {
            throw Error("Attempted to call function more than once");
          } else {
            _once = true;
          }
          $code = $jsCode.find("code");
          $code.text(err != null ? "// Error: " + String(err) : result.code);
          return setImmediate((_once2 = false, function () {
            if (_once2) {
              throw Error("Attempted to call function more than once");
            } else {
              _once2 = true;
            }
            Prism.highlightElement($code[0]);
            working = false;
            return flush();
          }));
        }));
      }
      return function (gsCode, $jsCode) {
        $jsCode.find("code").text("// Compiling...");
        pending.push({ gsCode: gsCode, $jsCode: $jsCode });
        return flush();
      };
    }());
    $(".gs-code").each(function () {
      var $div, $this;
      $this = $(this);
      if ($this.hasClass("no-convert")) {
        return;
      }
      $div = $("<div>");
      $this.replaceWith($div);
      $div.append($("<ul class='tabs'><li class='gs-tab active'><a href='#'>GorillaScript</a><li class='js-tab'><a href='#'>JavaScript</a></ul>"));
      $div.append($this);
      return $div.find(".tabs a").on("click", safe(function () {
        var $jsCode;
        $div.find(".tabs li").removeClass("active");
        $(this).parent().addClass("active");
        if ($(this).parent().hasClass("gs-tab")) {
          $div.find(".js-code").hide();
          $div.find(".gs-code").show();
        } else {
          $div.find(".gs-code").hide();
          $jsCode = $div.find(".js-code");
          if ($jsCode.length === 0) {
            $jsCode = $("<pre class='js-code'><code class='language-javascript'></code></pre>");
            $div.append($jsCode);
            sideBySide($this.find("code").text(), $jsCode);
          }
          $jsCode.show();
        }
        return false;
      }));
    });
    function f() {
      var $elements;
      if (!Prism.languages.gorillascript) {
        return setTimeout(f, 17);
      }
      $elements = $('code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code');
      return __async(
        1,
        __num($elements.length),
        false,
        function (_i, next) {
          var element;
          element = $elements[_i];
          Prism.highlightElement(element);
          return setImmediate(next);
        },
        function (_err) {}
      );
    }
    return f();
  });
}.call(this, typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this));
