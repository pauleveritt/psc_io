!(function (global, factory) {
  "object" == typeof exports && "undefined" != typeof module
    ? factory(exports)
    : "function" == typeof define && define.amd
    ? define(["exports"], factory)
    : factory(
        ((global =
          "undefined" != typeof globalThis
            ? globalThis
            : global || self).loadPyodide = {})
      );
})(this, function (exports) {
  "use strict";
  /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */ function __awaiter(
    thisArg,
    _arguments,
    P,
    generator
  ) {
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        var value;
        result.done
          ? resolve(result.value)
          : ((value = result.value),
            value instanceof P
              ? value
              : new P(function (resolve) {
                  resolve(value);
                })).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  }
  "undefined" != typeof globalThis
    ? globalThis
    : "undefined" != typeof window
    ? window
    : "undefined" != typeof global
    ? global
    : "undefined" != typeof self && self;
  var errorStackParser = { exports: {} },
    stackframe = { exports: {} };
  !(function (module, exports) {
    module.exports = (function () {
      function _isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
      }
      function _capitalize(str) {
        return str.charAt(0).toUpperCase() + str.substring(1);
      }
      function _getter(p) {
        return function () {
          return this[p];
        };
      }
      var booleanProps = ["isConstructor", "isEval", "isNative", "isToplevel"],
        numericProps = ["columnNumber", "lineNumber"],
        stringProps = ["fileName", "functionName", "source"],
        arrayProps = ["args"],
        objectProps = ["evalOrigin"],
        props = booleanProps.concat(
          numericProps,
          stringProps,
          arrayProps,
          objectProps
        );
      function StackFrame(obj) {
        if (obj)
          for (var i = 0; i < props.length; i++)
            void 0 !== obj[props[i]] &&
              this["set" + _capitalize(props[i])](obj[props[i]]);
      }
      (StackFrame.prototype = {
        getArgs: function () {
          return this.args;
        },
        setArgs: function (v) {
          if ("[object Array]" !== Object.prototype.toString.call(v))
            throw new TypeError("Args must be an Array");
          this.args = v;
        },
        getEvalOrigin: function () {
          return this.evalOrigin;
        },
        setEvalOrigin: function (v) {
          if (v instanceof StackFrame) this.evalOrigin = v;
          else {
            if (!(v instanceof Object))
              throw new TypeError(
                "Eval Origin must be an Object or StackFrame"
              );
            this.evalOrigin = new StackFrame(v);
          }
        },
        toString: function () {
          var fileName = this.getFileName() || "",
            lineNumber = this.getLineNumber() || "",
            columnNumber = this.getColumnNumber() || "",
            functionName = this.getFunctionName() || "";
          return this.getIsEval()
            ? fileName
              ? "[eval] (" +
                fileName +
                ":" +
                lineNumber +
                ":" +
                columnNumber +
                ")"
              : "[eval]:" + lineNumber + ":" + columnNumber
            : functionName
            ? functionName +
              " (" +
              fileName +
              ":" +
              lineNumber +
              ":" +
              columnNumber +
              ")"
            : fileName + ":" + lineNumber + ":" + columnNumber;
        },
      }),
        (StackFrame.fromString = function (str) {
          var argsStartIndex = str.indexOf("("),
            argsEndIndex = str.lastIndexOf(")"),
            functionName = str.substring(0, argsStartIndex),
            args = str.substring(argsStartIndex + 1, argsEndIndex).split(","),
            locationString = str.substring(argsEndIndex + 1);
          if (0 === locationString.indexOf("@"))
            var parts = /@(.+?)(?::(\d+))?(?::(\d+))?$/.exec(
                locationString,
                ""
              ),
              fileName = parts[1],
              lineNumber = parts[2],
              columnNumber = parts[3];
          return new StackFrame({
            functionName: functionName,
            args: args || void 0,
            fileName: fileName,
            lineNumber: lineNumber || void 0,
            columnNumber: columnNumber || void 0,
          });
        });
      for (var i = 0; i < booleanProps.length; i++)
        (StackFrame.prototype["get" + _capitalize(booleanProps[i])] = _getter(
          booleanProps[i]
        )),
          (StackFrame.prototype["set" + _capitalize(booleanProps[i])] =
            (function (p) {
              return function (v) {
                this[p] = Boolean(v);
              };
            })(booleanProps[i]));
      for (var j = 0; j < numericProps.length; j++)
        (StackFrame.prototype["get" + _capitalize(numericProps[j])] = _getter(
          numericProps[j]
        )),
          (StackFrame.prototype["set" + _capitalize(numericProps[j])] =
            (function (p) {
              return function (v) {
                if (!_isNumber(v)) throw new TypeError(p + " must be a Number");
                this[p] = Number(v);
              };
            })(numericProps[j]));
      for (var k = 0; k < stringProps.length; k++)
        (StackFrame.prototype["get" + _capitalize(stringProps[k])] = _getter(
          stringProps[k]
        )),
          (StackFrame.prototype["set" + _capitalize(stringProps[k])] =
            (function (p) {
              return function (v) {
                this[p] = String(v);
              };
            })(stringProps[k]));
      return StackFrame;
    })();
  })(stackframe),
    (function (module, exports) {
      var StackFrame,
        FIREFOX_SAFARI_STACK_REGEXP,
        CHROME_IE_STACK_REGEXP,
        SAFARI_NATIVE_CODE_REGEXP;
      module.exports =
        ((StackFrame = stackframe.exports),
        (FIREFOX_SAFARI_STACK_REGEXP = /(^|@)\S+:\d+/),
        (CHROME_IE_STACK_REGEXP = /^\s*at .*(\S+:\d+|\(native\))/m),
        (SAFARI_NATIVE_CODE_REGEXP = /^(eval@)?(\[native code])?$/),
        {
          parse: function (error) {
            if (
              void 0 !== error.stacktrace ||
              void 0 !== error["opera#sourceloc"]
            )
              return this.parseOpera(error);
            if (error.stack && error.stack.match(CHROME_IE_STACK_REGEXP))
              return this.parseV8OrIE(error);
            if (error.stack) return this.parseFFOrSafari(error);
            throw new Error("Cannot parse given Error object");
          },
          extractLocation: function (urlLike) {
            if (-1 === urlLike.indexOf(":")) return [urlLike];
            var parts = /(.+?)(?::(\d+))?(?::(\d+))?$/.exec(
              urlLike.replace(/[()]/g, "")
            );
            return [parts[1], parts[2] || void 0, parts[3] || void 0];
          },
          parseV8OrIE: function (error) {
            return error.stack
              .split("\n")
              .filter(function (line) {
                return !!line.match(CHROME_IE_STACK_REGEXP);
              }, this)
              .map(function (line) {
                line.indexOf("(eval ") > -1 &&
                  (line = line
                    .replace(/eval code/g, "eval")
                    .replace(/(\(eval at [^()]*)|(\),.*$)/g, ""));
                var sanitizedLine = line
                    .replace(/^\s+/, "")
                    .replace(/\(eval code/g, "("),
                  location = sanitizedLine.match(/ (\((.+):(\d+):(\d+)\)$)/),
                  tokens = (sanitizedLine = location
                    ? sanitizedLine.replace(location[0], "")
                    : sanitizedLine)
                    .split(/\s+/)
                    .slice(1),
                  locationParts = this.extractLocation(
                    location ? location[1] : tokens.pop()
                  ),
                  functionName = tokens.join(" ") || void 0,
                  fileName =
                    ["eval", "<anonymous>"].indexOf(locationParts[0]) > -1
                      ? void 0
                      : locationParts[0];
                return new StackFrame({
                  functionName: functionName,
                  fileName: fileName,
                  lineNumber: locationParts[1],
                  columnNumber: locationParts[2],
                  source: line,
                });
              }, this);
          },
          parseFFOrSafari: function (error) {
            return error.stack
              .split("\n")
              .filter(function (line) {
                return !line.match(SAFARI_NATIVE_CODE_REGEXP);
              }, this)
              .map(function (line) {
                if (
                  (line.indexOf(" > eval") > -1 &&
                    (line = line.replace(
                      / line (\d+)(?: > eval line \d+)* > eval:\d+:\d+/g,
                      ":$1"
                    )),
                  -1 === line.indexOf("@") && -1 === line.indexOf(":"))
                )
                  return new StackFrame({ functionName: line });
                var functionNameRegex = /((.*".+"[^@]*)?[^@]*)(?:@)/,
                  matches = line.match(functionNameRegex),
                  functionName = matches && matches[1] ? matches[1] : void 0,
                  locationParts = this.extractLocation(
                    line.replace(functionNameRegex, "")
                  );
                return new StackFrame({
                  functionName: functionName,
                  fileName: locationParts[0],
                  lineNumber: locationParts[1],
                  columnNumber: locationParts[2],
                  source: line,
                });
              }, this);
          },
          parseOpera: function (e) {
            return !e.stacktrace ||
              (e.message.indexOf("\n") > -1 &&
                e.message.split("\n").length > e.stacktrace.split("\n").length)
              ? this.parseOpera9(e)
              : e.stack
              ? this.parseOpera11(e)
              : this.parseOpera10(e);
          },
          parseOpera9: function (e) {
            for (
              var lineRE = /Line (\d+).*script (?:in )?(\S+)/i,
                lines = e.message.split("\n"),
                result = [],
                i = 2,
                len = lines.length;
              i < len;
              i += 2
            ) {
              var match = lineRE.exec(lines[i]);
              match &&
                result.push(
                  new StackFrame({
                    fileName: match[2],
                    lineNumber: match[1],
                    source: lines[i],
                  })
                );
            }
            return result;
          },
          parseOpera10: function (e) {
            for (
              var lineRE =
                  /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i,
                lines = e.stacktrace.split("\n"),
                result = [],
                i = 0,
                len = lines.length;
              i < len;
              i += 2
            ) {
              var match = lineRE.exec(lines[i]);
              match &&
                result.push(
                  new StackFrame({
                    functionName: match[3] || void 0,
                    fileName: match[2],
                    lineNumber: match[1],
                    source: lines[i],
                  })
                );
            }
            return result;
          },
          parseOpera11: function (error) {
            return error.stack
              .split("\n")
              .filter(function (line) {
                return (
                  !!line.match(FIREFOX_SAFARI_STACK_REGEXP) &&
                  !line.match(/^Error created at/)
                );
              }, this)
              .map(function (line) {
                var argsRaw,
                  tokens = line.split("@"),
                  locationParts = this.extractLocation(tokens.pop()),
                  functionCall = tokens.shift() || "",
                  functionName =
                    functionCall
                      .replace(/<anonymous function(: (\w+))?>/, "$2")
                      .replace(/\([^)]*\)/g, "") || void 0;
                functionCall.match(/\(([^)]*)\)/) &&
                  (argsRaw = functionCall.replace(/^[^(]+\(([^)]*)\)$/, "$1"));
                var args =
                  void 0 === argsRaw || "[arguments not available]" === argsRaw
                    ? void 0
                    : argsRaw.split(",");
                return new StackFrame({
                  functionName: functionName,
                  args: args,
                  fileName: locationParts[0],
                  lineNumber: locationParts[1],
                  columnNumber: locationParts[2],
                  source: line,
                });
              }, this);
          },
        });
    })(errorStackParser);
  var ErrorStackParser = errorStackParser.exports;
  let Module = {
      noImageDecoding: !0,
      noAudioDecoding: !0,
      noWasmDecoding: !1,
      preloadedWasm: {},
      preRun: [],
    },
    API = {};
  Module.API = API;
  let Hiwire = {};
  Module.hiwire = Hiwire;
  let Tests = {};
  function setStandardStreams(stdin, stdout, stderr) {
    stdout && (Module.print = stdout),
      stderr && (Module.printErr = stderr),
      stdin &&
        Module.preRun.push(function () {
          Module.FS.init(
            (function (stdin) {
              const encoder = new TextEncoder();
              let input = new Uint8Array(0),
                inputIndex = -1;
              function stdinWrapper() {
                try {
                  if (-1 === inputIndex) {
                    let text = stdin();
                    if (null == text) return null;
                    if ("string" != typeof text)
                      throw new TypeError(
                        `Expected stdin to return string, null, or undefined, got type ${typeof text}.`
                      );
                    text.endsWith("\n") || (text += "\n"),
                      (input = encoder.encode(text)),
                      (inputIndex = 0);
                  }
                  if (inputIndex < input.length) {
                    let character = input[inputIndex];
                    return inputIndex++, character;
                  }
                  return (inputIndex = -1), null;
                } catch (e) {
                  throw (
                    (console.error("Error thrown in stdin:"),
                    console.error(e),
                    e)
                  );
                }
              }
              return stdinWrapper;
            })(stdin),
            null,
            null
          );
        });
  }
  API.tests = Tests;
  const IN_NODE =
    "undefined" != typeof process &&
    process.release &&
    "node" === process.release.name &&
    void 0 === process.browser;
  let nodePathMod,
    nodeFetch,
    nodeVmMod,
    nodeFsPromisesMod,
    _loadBinaryFile,
    loadScript;
  if (
    ((_loadBinaryFile = IN_NODE
      ? function (indexURL, path) {
          return __awaiter(this, void 0, void 0, function* () {
            if (path.includes("://")) {
              let response = yield nodeFetch(path);
              if (!response.ok)
                throw new Error(`Failed to load '${path}': request failed.`);
              return yield response.arrayBuffer();
            }
            {
              const data = yield nodeFsPromisesMod.readFile(
                `${indexURL}${path}`
              );
              return new Uint8Array(
                data.buffer,
                data.byteOffset,
                data.byteLength
              );
            }
          });
        }
      : function (indexURL, path) {
          return __awaiter(this, void 0, void 0, function* () {
            const base = new URL(indexURL, location),
              url = new URL(path, base);
            let response = yield fetch(url);
            if (!response.ok)
              throw new Error(`Failed to load '${url}': request failed.`);
            return new Uint8Array(yield response.arrayBuffer());
          });
        }),
    globalThis.document)
  )
    loadScript = (url) =>
      __awaiter(void 0, void 0, void 0, function* () {
        return yield import(url);
      });
  else if (globalThis.importScripts)
    loadScript = (url) =>
      __awaiter(void 0, void 0, void 0, function* () {
        try {
          globalThis.importScripts(url);
        } catch (e) {
          if (!(e instanceof TypeError)) throw e;
          yield import(url);
        }
      });
  else {
    if (!IN_NODE) throw new Error("Cannot determine runtime environment");
    loadScript = function (url) {
      return __awaiter(this, void 0, void 0, function* () {
        url.includes("://")
          ? nodeVmMod.runInThisContext(yield (yield nodeFetch(url)).text())
          : yield import(nodePathMod.resolve(url));
      });
    };
  }
  function isPyProxy(jsobj) {
    return !!jsobj && void 0 !== jsobj.$$ && "PyProxy" === jsobj.$$.type;
  }
  (API.isPyProxy = isPyProxy),
    globalThis.FinalizationRegistry
      ? (Module.finalizationRegistry = new FinalizationRegistry(
          ([ptr, cache]) => {
            (cache.leaked = !0), pyproxy_decref_cache(cache);
            try {
              Module._Py_DecRef(ptr);
            } catch (e) {
              API.fatal_error(e);
            }
          }
        ))
      : (Module.finalizationRegistry = { register() {}, unregister() {} });
  let trace_pyproxy_alloc,
    trace_pyproxy_dealloc,
    pyproxy_alloc_map = new Map();
  function _getPtr(jsobj) {
    let ptr = jsobj.$$.ptr;
    if (0 === ptr) throw new Error(jsobj.$$.destroyed_msg);
    return ptr;
  }
  (Module.pyproxy_alloc_map = pyproxy_alloc_map),
    (Module.enable_pyproxy_allocation_tracing = function () {
      (trace_pyproxy_alloc = function (proxy) {
        pyproxy_alloc_map.set(proxy, Error().stack);
      }),
        (trace_pyproxy_dealloc = function (proxy) {
          pyproxy_alloc_map.delete(proxy);
        });
    }),
    (Module.disable_pyproxy_allocation_tracing = function () {
      (trace_pyproxy_alloc = function (proxy) {}),
        (trace_pyproxy_dealloc = function (proxy) {});
    }),
    Module.disable_pyproxy_allocation_tracing(),
    (Module.pyproxy_new = function (ptrobj, cache) {
      let target,
        flags = Module._pyproxy_getflags(ptrobj),
        cls = Module.getPyProxyClass(flags);
      if (
        (256 & flags
          ? ((target = Reflect.construct(Function, [], cls)),
            delete target.length,
            delete target.name,
            (target.prototype = void 0))
          : (target = Object.create(cls.prototype)),
        !cache)
      ) {
        cache = { cacheId: Hiwire.new_value(new Map()), refcnt: 0 };
      }
      cache.refcnt++,
        Object.defineProperty(target, "$$", {
          value: { ptr: ptrobj, type: "PyProxy", cache: cache },
        }),
        Module._Py_IncRef(ptrobj);
      let proxy = new Proxy(target, PyProxyHandlers);
      return (
        trace_pyproxy_alloc(proxy),
        Module.finalizationRegistry.register(proxy, [ptrobj, cache], proxy),
        proxy
      );
    });
  let pyproxyClassMap = new Map();
  (Module.getPyProxyClass = function (flags) {
    const FLAG_TYPE_PAIRS = [
      [1, PyProxyLengthMethods],
      [2, PyProxyGetItemMethods],
      [4, PyProxySetItemMethods],
      [8, PyProxyContainsMethods],
      [16, PyProxyIterableMethods],
      [32, PyProxyIteratorMethods],
      [64, PyProxyAwaitableMethods],
      [128, PyProxyBufferMethods],
      [256, PyProxyCallableMethods],
    ];
    let result = pyproxyClassMap.get(flags);
    if (result) return result;
    let descriptors = {};
    for (let [feature_flag, methods] of FLAG_TYPE_PAIRS)
      flags & feature_flag &&
        Object.assign(
          descriptors,
          Object.getOwnPropertyDescriptors(methods.prototype)
        );
    (descriptors.constructor = Object.getOwnPropertyDescriptor(
      PyProxyClass.prototype,
      "constructor"
    )),
      Object.assign(
        descriptors,
        Object.getOwnPropertyDescriptors({ $$flags: flags })
      );
    let new_proto = Object.create(PyProxyClass.prototype, descriptors);
    function NewPyProxyClass() {}
    return (
      (NewPyProxyClass.prototype = new_proto),
      pyproxyClassMap.set(flags, NewPyProxyClass),
      NewPyProxyClass
    );
  }),
    (Module.PyProxy_getPtr = _getPtr);
  function pyproxy_decref_cache(cache) {
    if (cache && (cache.refcnt--, 0 === cache.refcnt)) {
      let cache_map = Hiwire.pop_value(cache.cacheId);
      for (let proxy_id of cache_map.values()) {
        const cache_entry = Hiwire.pop_value(proxy_id);
        cache.leaked ||
          Module.pyproxy_destroy(
            cache_entry,
            "This borrowed attribute proxy was automatically destroyed in the process of destroying the proxy it was borrowed from. Try using the 'copy' method."
          );
      }
    }
  }
  (Module.pyproxy_destroy = function (proxy, destroyed_msg) {
    if (0 === proxy.$$.ptr) return;
    let ptrobj = _getPtr(proxy);
    Module.finalizationRegistry.unregister(proxy),
      (destroyed_msg = destroyed_msg || "Object has already been destroyed");
    let proxy_repr,
      proxy_type = proxy.type;
    try {
      proxy_repr = proxy.toString();
    } catch (e) {
      if (e.pyodide_fatal_error) throw e;
    }
    (proxy.$$.ptr = 0),
      (destroyed_msg += `\nThe object was of type "${proxy_type}" and `),
      (destroyed_msg += proxy_repr
        ? `had repr "${proxy_repr}"`
        : "an error was raised when trying to generate its repr"),
      (proxy.$$.destroyed_msg = destroyed_msg),
      pyproxy_decref_cache(proxy.$$.cache);
    try {
      Module._Py_DecRef(ptrobj), trace_pyproxy_dealloc(proxy);
    } catch (e) {
      API.fatal_error(e);
    }
  }),
    (Module.callPyObjectKwargs = function (ptrobj, ...jsargs) {
      let kwargs = jsargs.pop(),
        num_pos_args = jsargs.length,
        kwargs_names = Object.keys(kwargs),
        kwargs_values = Object.values(kwargs),
        num_kwargs = kwargs_names.length;
      jsargs.push(...kwargs_values);
      let idresult,
        idargs = Hiwire.new_value(jsargs),
        idkwnames = Hiwire.new_value(kwargs_names);
      try {
        idresult = Module.__pyproxy_apply(
          ptrobj,
          idargs,
          num_pos_args,
          idkwnames,
          num_kwargs
        );
      } catch (e) {
        API.fatal_error(e);
      } finally {
        Hiwire.decref(idargs), Hiwire.decref(idkwnames);
      }
      0 === idresult && Module._pythonexc2js();
      let result = Hiwire.pop_value(idresult);
      return (
        result &&
          "coroutine" === result.type &&
          result._ensure_future &&
          result._ensure_future(),
        result
      );
    }),
    (Module.callPyObject = function (ptrobj, ...jsargs) {
      return Module.callPyObjectKwargs(ptrobj, ...jsargs, {});
    });
  class PyProxyClass {
    constructor() {
      throw new TypeError("PyProxy is not a constructor");
    }
    get [Symbol.toStringTag]() {
      return "PyProxy";
    }
    get type() {
      let ptrobj = _getPtr(this);
      return Hiwire.pop_value(Module.__pyproxy_type(ptrobj));
    }
    toString() {
      let jsref_repr,
        ptrobj = _getPtr(this);
      try {
        jsref_repr = Module.__pyproxy_repr(ptrobj);
      } catch (e) {
        API.fatal_error(e);
      }
      return (
        0 === jsref_repr && Module._pythonexc2js(), Hiwire.pop_value(jsref_repr)
      );
    }
    destroy(destroyed_msg) {
      Module.pyproxy_destroy(this, destroyed_msg);
    }
    copy() {
      let ptrobj = _getPtr(this);
      return Module.pyproxy_new(ptrobj, this.$$.cache);
    }
    toJs({
      depth: depth = -1,
      pyproxies: pyproxies,
      create_pyproxies: create_pyproxies = !0,
      dict_converter: dict_converter,
      default_converter: default_converter,
    } = {}) {
      let idresult,
        proxies_id,
        ptrobj = _getPtr(this),
        dict_converter_id = 0,
        default_converter_id = 0;
      (proxies_id = create_pyproxies
        ? pyproxies
          ? Hiwire.new_value(pyproxies)
          : Hiwire.new_value([])
        : 0),
        dict_converter &&
          (dict_converter_id = Hiwire.new_value(dict_converter)),
        default_converter &&
          (default_converter_id = Hiwire.new_value(default_converter));
      try {
        idresult = Module._python2js_custom(
          ptrobj,
          depth,
          proxies_id,
          dict_converter_id,
          default_converter_id
        );
      } catch (e) {
        API.fatal_error(e);
      } finally {
        Hiwire.decref(proxies_id),
          Hiwire.decref(dict_converter_id),
          Hiwire.decref(default_converter_id);
      }
      return (
        0 === idresult && Module._pythonexc2js(), Hiwire.pop_value(idresult)
      );
    }
    supportsLength() {
      return !!(1 & this.$$flags);
    }
    supportsGet() {
      return !!(2 & this.$$flags);
    }
    supportsSet() {
      return !!(4 & this.$$flags);
    }
    supportsHas() {
      return !!(8 & this.$$flags);
    }
    isIterable() {
      return !!(48 & this.$$flags);
    }
    isIterator() {
      return !!(32 & this.$$flags);
    }
    isAwaitable() {
      return !!(64 & this.$$flags);
    }
    isBuffer() {
      return !!(128 & this.$$flags);
    }
    isCallable() {
      return !!(256 & this.$$flags);
    }
  }
  class PyProxyLengthMethods {
    get length() {
      let length,
        ptrobj = _getPtr(this);
      try {
        length = Module._PyObject_Size(ptrobj);
      } catch (e) {
        API.fatal_error(e);
      }
      return -1 === length && Module._pythonexc2js(), length;
    }
  }
  class PyProxyGetItemMethods {
    get(key) {
      let idresult,
        ptrobj = _getPtr(this),
        idkey = Hiwire.new_value(key);
      try {
        idresult = Module.__pyproxy_getitem(ptrobj, idkey);
      } catch (e) {
        API.fatal_error(e);
      } finally {
        Hiwire.decref(idkey);
      }
      if (0 === idresult) {
        if (!Module._PyErr_Occurred()) return;
        Module._pythonexc2js();
      }
      return Hiwire.pop_value(idresult);
    }
  }
  class PyProxySetItemMethods {
    set(key, value) {
      let errcode,
        ptrobj = _getPtr(this),
        idkey = Hiwire.new_value(key),
        idval = Hiwire.new_value(value);
      try {
        errcode = Module.__pyproxy_setitem(ptrobj, idkey, idval);
      } catch (e) {
        API.fatal_error(e);
      } finally {
        Hiwire.decref(idkey), Hiwire.decref(idval);
      }
      -1 === errcode && Module._pythonexc2js();
    }
    delete(key) {
      let errcode,
        ptrobj = _getPtr(this),
        idkey = Hiwire.new_value(key);
      try {
        errcode = Module.__pyproxy_delitem(ptrobj, idkey);
      } catch (e) {
        API.fatal_error(e);
      } finally {
        Hiwire.decref(idkey);
      }
      -1 === errcode && Module._pythonexc2js();
    }
  }
  class PyProxyContainsMethods {
    has(key) {
      let result,
        ptrobj = _getPtr(this),
        idkey = Hiwire.new_value(key);
      try {
        result = Module.__pyproxy_contains(ptrobj, idkey);
      } catch (e) {
        API.fatal_error(e);
      } finally {
        Hiwire.decref(idkey);
      }
      return -1 === result && Module._pythonexc2js(), 1 === result;
    }
  }
  class PyProxyIterableMethods {
    [Symbol.iterator]() {
      let iterptr,
        ptrobj = _getPtr(this),
        token = {};
      try {
        iterptr = Module._PyObject_GetIter(ptrobj);
      } catch (e) {
        API.fatal_error(e);
      }
      0 === iterptr && Module._pythonexc2js();
      let result = (function* (iterptr, token) {
        try {
          let item;
          for (; (item = Module.__pyproxy_iter_next(iterptr)); )
            yield Hiwire.pop_value(item);
        } catch (e) {
          API.fatal_error(e);
        } finally {
          Module.finalizationRegistry.unregister(token),
            Module._Py_DecRef(iterptr);
        }
        Module._PyErr_Occurred() && Module._pythonexc2js();
      })(iterptr, token);
      return (
        Module.finalizationRegistry.register(result, [iterptr, void 0], token),
        result
      );
    }
  }
  class PyProxyIteratorMethods {
    [Symbol.iterator]() {
      return this;
    }
    next(arg) {
      let status,
        done,
        idarg = Hiwire.new_value(arg),
        stackTop = Module.stackSave(),
        res_ptr = Module.stackAlloc(4);
      try {
        status = Module.__pyproxyGen_Send(_getPtr(this), idarg, res_ptr);
      } catch (e) {
        API.fatal_error(e);
      } finally {
        Hiwire.decref(idarg);
      }
      let idresult = Module.HEAPU32[0 + (res_ptr >> 2)];
      return (
        Module.stackRestore(stackTop),
        -1 === status && Module._pythonexc2js(),
        (done = 0 === status),
        { done: done, value: Hiwire.pop_value(idresult) }
      );
    }
  }
  let PyProxyHandlers = {
    isExtensible: () => !0,
    has: (jsobj, jskey) =>
      !!Reflect.has(jsobj, jskey) ||
      ("symbol" != typeof jskey &&
        (jskey.startsWith("$") && (jskey = jskey.slice(1)),
        (function (jsobj, jskey) {
          let result,
            ptrobj = _getPtr(jsobj),
            idkey = Hiwire.new_value(jskey);
          try {
            result = Module.__pyproxy_hasattr(ptrobj, idkey);
          } catch (e) {
            API.fatal_error(e);
          } finally {
            Hiwire.decref(idkey);
          }
          return -1 === result && Module._pythonexc2js(), 0 !== result;
        })(jsobj, jskey))),
    get(jsobj, jskey) {
      if (jskey in jsobj || "symbol" == typeof jskey)
        return Reflect.get(jsobj, jskey);
      jskey.startsWith("$") && (jskey = jskey.slice(1));
      let idresult = (function (jsobj, jskey) {
        let idresult,
          ptrobj = _getPtr(jsobj),
          idkey = Hiwire.new_value(jskey),
          cacheId = jsobj.$$.cache.cacheId;
        try {
          idresult = Module.__pyproxy_getattr(ptrobj, idkey, cacheId);
        } catch (e) {
          API.fatal_error(e);
        } finally {
          Hiwire.decref(idkey);
        }
        return (
          0 === idresult && Module._PyErr_Occurred() && Module._pythonexc2js(),
          idresult
        );
      })(jsobj, jskey);
      return 0 !== idresult ? Hiwire.pop_value(idresult) : void 0;
    },
    set(jsobj, jskey, jsval) {
      let descr = Object.getOwnPropertyDescriptor(jsobj, jskey);
      if (descr && !descr.writable)
        throw new TypeError(`Cannot set read only field '${jskey}'`);
      return "symbol" == typeof jskey
        ? Reflect.set(jsobj, jskey, jsval)
        : (jskey.startsWith("$") && (jskey = jskey.slice(1)),
          (function (jsobj, jskey, jsval) {
            let errcode,
              ptrobj = _getPtr(jsobj),
              idkey = Hiwire.new_value(jskey),
              idval = Hiwire.new_value(jsval);
            try {
              errcode = Module.__pyproxy_setattr(ptrobj, idkey, idval);
            } catch (e) {
              API.fatal_error(e);
            } finally {
              Hiwire.decref(idkey), Hiwire.decref(idval);
            }
            -1 === errcode && Module._pythonexc2js();
          })(jsobj, jskey, jsval),
          !0);
    },
    deleteProperty(jsobj, jskey) {
      let descr = Object.getOwnPropertyDescriptor(jsobj, jskey);
      if (descr && !descr.writable)
        throw new TypeError(`Cannot delete read only field '${jskey}'`);
      return "symbol" == typeof jskey
        ? Reflect.deleteProperty(jsobj, jskey)
        : (jskey.startsWith("$") && (jskey = jskey.slice(1)),
          (function (jsobj, jskey) {
            let errcode,
              ptrobj = _getPtr(jsobj),
              idkey = Hiwire.new_value(jskey);
            try {
              errcode = Module.__pyproxy_delattr(ptrobj, idkey);
            } catch (e) {
              API.fatal_error(e);
            } finally {
              Hiwire.decref(idkey);
            }
            -1 === errcode && Module._pythonexc2js();
          })(jsobj, jskey),
          !descr || !!descr.configurable);
    },
    ownKeys(jsobj) {
      let idresult,
        ptrobj = _getPtr(jsobj);
      try {
        idresult = Module.__pyproxy_ownKeys(ptrobj);
      } catch (e) {
        API.fatal_error(e);
      }
      0 === idresult && Module._pythonexc2js();
      let result = Hiwire.pop_value(idresult);
      return result.push(...Reflect.ownKeys(jsobj)), result;
    },
    apply: (jsobj, jsthis, jsargs) => jsobj.apply(jsthis, jsargs),
  };
  class PyProxyAwaitableMethods {
    _ensure_future() {
      if (this.$$.promise) return this.$$.promise;
      let resolveHandle,
        rejectHandle,
        errcode,
        ptrobj = _getPtr(this),
        promise = new Promise((resolve, reject) => {
          (resolveHandle = resolve), (rejectHandle = reject);
        }),
        resolve_handle_id = Hiwire.new_value(resolveHandle),
        reject_handle_id = Hiwire.new_value(rejectHandle);
      try {
        errcode = Module.__pyproxy_ensure_future(
          ptrobj,
          resolve_handle_id,
          reject_handle_id
        );
      } catch (e) {
        API.fatal_error(e);
      } finally {
        Hiwire.decref(reject_handle_id), Hiwire.decref(resolve_handle_id);
      }
      return (
        -1 === errcode && Module._pythonexc2js(),
        (this.$$.promise = promise),
        this.destroy(),
        promise
      );
    }
    then(onFulfilled, onRejected) {
      return this._ensure_future().then(onFulfilled, onRejected);
    }
    catch(onRejected) {
      return this._ensure_future().catch(onRejected);
    }
    finally(onFinally) {
      return this._ensure_future().finally(onFinally);
    }
  }
  class PyProxyCallableMethods {
    apply(jsthis, jsargs) {
      return Module.callPyObject(_getPtr(this), ...jsargs);
    }
    call(jsthis, ...jsargs) {
      return Module.callPyObject(_getPtr(this), ...jsargs);
    }
    callKwargs(...jsargs) {
      if (0 === jsargs.length)
        throw new TypeError(
          "callKwargs requires at least one argument (the key word argument object)"
        );
      let kwargs = jsargs[jsargs.length - 1];
      if (void 0 !== kwargs.constructor && "Object" !== kwargs.constructor.name)
        throw new TypeError("kwargs argument is not an object");
      return Module.callPyObjectKwargs(_getPtr(this), ...jsargs);
    }
  }
  PyProxyCallableMethods.prototype.prototype = Function.prototype;
  let baseURL,
    type_to_array_map = new Map([
      ["i8", Int8Array],
      ["u8", Uint8Array],
      ["u8clamped", Uint8ClampedArray],
      ["i16", Int16Array],
      ["u16", Uint16Array],
      ["i32", Int32Array],
      ["u32", Uint32Array],
      ["i32", Int32Array],
      ["u32", Uint32Array],
      ["i64", globalThis.BigInt64Array],
      ["u64", globalThis.BigUint64Array],
      ["f32", Float32Array],
      ["f64", Float64Array],
      ["dataview", DataView],
    ]);
  class PyProxyBufferMethods {
    getBuffer(type) {
      let ArrayType;
      if (
        type &&
        ((ArrayType = type_to_array_map.get(type)), void 0 === ArrayType)
      )
        throw new Error(`Unknown type ${type}`);
      let errcode,
        HEAPU32 = Module.HEAPU32,
        orig_stack_ptr = Module.stackSave(),
        buffer_struct_ptr = Module.stackAlloc(
          HEAPU32[0 + (Module._buffer_struct_size >> 2)]
        ),
        this_ptr = _getPtr(this);
      try {
        errcode = Module.__pyproxy_get_buffer(buffer_struct_ptr, this_ptr);
      } catch (e) {
        API.fatal_error(e);
      }
      -1 === errcode && Module._pythonexc2js();
      let startByteOffset = HEAPU32[0 + (buffer_struct_ptr >> 2)],
        minByteOffset = HEAPU32[1 + (buffer_struct_ptr >> 2)],
        maxByteOffset = HEAPU32[2 + (buffer_struct_ptr >> 2)],
        readonly = !!HEAPU32[3 + (buffer_struct_ptr >> 2)],
        format_ptr = HEAPU32[4 + (buffer_struct_ptr >> 2)],
        itemsize = HEAPU32[5 + (buffer_struct_ptr >> 2)],
        shape = Hiwire.pop_value(HEAPU32[6 + (buffer_struct_ptr >> 2)]),
        strides = Hiwire.pop_value(HEAPU32[7 + (buffer_struct_ptr >> 2)]),
        view_ptr = HEAPU32[8 + (buffer_struct_ptr >> 2)],
        c_contiguous = !!HEAPU32[9 + (buffer_struct_ptr >> 2)],
        f_contiguous = !!HEAPU32[10 + (buffer_struct_ptr >> 2)],
        format = Module.UTF8ToString(format_ptr);
      Module.stackRestore(orig_stack_ptr);
      let success = !1;
      try {
        let bigEndian = !1;
        void 0 === ArrayType &&
          ([ArrayType, bigEndian] = Module.processBufferFormatString(
            format,
            " In this case, you can pass an explicit type argument."
          ));
        let alignment =
          parseInt(ArrayType.name.replace(/[^0-9]/g, "")) / 8 || 1;
        if (bigEndian && alignment > 1)
          throw new Error(
            "Javascript has no native support for big endian buffers. In this case, you can pass an explicit type argument. For instance, `getBuffer('dataview')` will return a `DataView`which has native support for reading big endian data. Alternatively, toJs will automatically convert the buffer to little endian."
          );
        let numBytes = maxByteOffset - minByteOffset;
        if (
          0 !== numBytes &&
          (startByteOffset % alignment != 0 ||
            minByteOffset % alignment != 0 ||
            maxByteOffset % alignment != 0)
        )
          throw new Error(
            `Buffer does not have valid alignment for a ${ArrayType.name}`
          );
        let data,
          numEntries = numBytes / alignment,
          offset = (startByteOffset - minByteOffset) / alignment;
        data =
          0 === numBytes
            ? new ArrayType()
            : new ArrayType(HEAPU32.buffer, minByteOffset, numEntries);
        for (let i of strides.keys()) strides[i] /= alignment;
        return (
          (success = !0),
          Object.create(
            PyBuffer.prototype,
            Object.getOwnPropertyDescriptors({
              offset: offset,
              readonly: readonly,
              format: format,
              itemsize: itemsize,
              ndim: shape.length,
              nbytes: numBytes,
              shape: shape,
              strides: strides,
              data: data,
              c_contiguous: c_contiguous,
              f_contiguous: f_contiguous,
              _view_ptr: view_ptr,
              _released: !1,
            })
          )
        );
      } finally {
        if (!success)
          try {
            Module._PyBuffer_Release(view_ptr), Module._PyMem_Free(view_ptr);
          } catch (e) {
            API.fatal_error(e);
          }
      }
    }
  }
  class PyBuffer {
    constructor() {
      throw new TypeError("PyBuffer is not a constructor");
    }
    release() {
      if (!this._released) {
        try {
          Module._PyBuffer_Release(this._view_ptr),
            Module._PyMem_Free(this._view_ptr);
        } catch (e) {
          API.fatal_error(e);
        }
        (this._released = !0), (this.data = null);
      }
    }
  }
  const package_uri_regexp = /^.*?([^\/]*)\.whl$/;
  function _uri_to_package_name(package_uri) {
    let match = package_uri_regexp.exec(package_uri);
    if (match) {
      return match[1].toLowerCase().split("-").slice(0, -4).join("-");
    }
  }
  function addPackageToLoad(name, toLoad, toLoadShared) {
    if (((name = name.toLowerCase()), toLoad.has(name))) return;
    const pkg_info = API.packages[name];
    if (!pkg_info) throw new Error(`No known package with name '${name}'`);
    if (
      (pkg_info.shared_library
        ? toLoadShared.set(name, "default channel")
        : toLoad.set(name, "default channel"),
      void 0 === loadedPackages[name])
    )
      for (let dep_name of pkg_info.depends)
        addPackageToLoad(dep_name, toLoad, toLoadShared);
  }
  function downloadPackage(name, channel) {
    return __awaiter(this, void 0, void 0, function* () {
      let file_name;
      if ("default channel" === channel) {
        if (!(name in API.packages))
          throw new Error(`Internal error: no entry for package named ${name}`);
        file_name = API.packages[name].file_name;
      } else file_name = channel;
      return yield _loadBinaryFile(baseURL, file_name);
    });
  }
  function installPackage(name, buffer) {
    return __awaiter(this, void 0, void 0, function* () {
      let pkg = API.packages[name];
      pkg ||
        (pkg = {
          file_name: ".whl",
          install_dir: "site",
          shared_library: !1,
          depends: [],
          imports: [],
        });
      const filename = pkg.file_name,
        dynlibs = API.package_loader.unpack_buffer.callKwargs({
          buffer: buffer,
          filename: filename,
          target: pkg.install_dir,
          calculate_dynlibs: !0,
        });
      for (const dynlib of dynlibs)
        yield loadDynlib(dynlib, pkg.shared_library);
      loadedPackages[name] = pkg;
    });
  }
  function createLock() {
    let _lock = Promise.resolve();
    return function () {
      return __awaiter(this, void 0, void 0, function* () {
        const old_lock = _lock;
        let releaseLock;
        return (
          (_lock = new Promise((resolve) => (releaseLock = resolve))),
          yield old_lock,
          releaseLock
        );
      });
    };
  }
  const acquireDynlibLock = createLock();
  function loadDynlib(lib, shared) {
    return __awaiter(this, void 0, void 0, function* () {
      let byteArray;
      byteArray =
        Module.FS.lookupPath(lib).node.mount.type == Module.FS.filesystems.MEMFS
          ? Module.FS.filesystems.MEMFS.getFileDataAsTypedArray(
              Module.FS.lookupPath(lib).node
            )
          : Module.FS.readFile(lib);
      const releaseDynlibLock = yield acquireDynlibLock();
      try {
        const module = yield Module.loadWebAssemblyModule(byteArray, {
          loadAsync: !0,
          nodelete: !0,
          allowUndefined: !0,
        });
        (Module.preloadedWasm[lib] = module),
          (Module.preloadedWasm[lib.split("/").pop()] = module),
          shared &&
            Module.loadDynamicLibrary(lib, { global: !0, nodelete: !0 });
      } catch (e) {
        if (e.message.includes("need to see wasm magic number"))
          return void console.warn(
            `Failed to load dynlib ${lib}. We probably just tried to load a linux .so file or something.`
          );
        throw e;
      } finally {
        releaseDynlibLock();
      }
    });
  }
  Tests.loadDynlib = loadDynlib;
  const acquirePackageLock = createLock();
  function loadPackage(names, messageCallback, errorCallback) {
    return __awaiter(this, void 0, void 0, function* () {
      (messageCallback = messageCallback || console.log),
        (errorCallback = errorCallback || console.error),
        isPyProxy(names) && (names = names.toJs()),
        Array.isArray(names) || (names = [names]);
      const [toLoad, toLoadShared] = (function (names, errorCallback) {
        const toLoad = new Map(),
          toLoadShared = new Map();
        for (let name of names) {
          const pkgname = _uri_to_package_name(name);
          void 0 !== pkgname
            ? toLoad.has(pkgname) && toLoad.get(pkgname) !== name
              ? errorCallback(
                  `Loading same package ${pkgname} from ${name} and ${toLoad.get(
                    pkgname
                  )}`
                )
              : toLoad.set(pkgname, name)
            : addPackageToLoad(name, toLoad, toLoadShared);
        }
        return [toLoad, toLoadShared];
      })(names, errorCallback);
      for (const [pkg, uri] of [...toLoad, ...toLoadShared]) {
        const loaded = loadedPackages[pkg];
        void 0 !== loaded &&
          (toLoad.delete(pkg),
          toLoadShared.delete(pkg),
          loaded === uri || "default channel" === uri
            ? messageCallback(`${pkg} already loaded from ${loaded}`)
            : errorCallback(
                `URI mismatch, attempting to load package ${pkg} from ${uri} while it is already loaded from ${loaded}. To override a dependency, load the custom package first.`
              ));
      }
      if (0 === toLoad.size && 0 === toLoadShared.size)
        return void messageCallback("No new packages to load");
      const packageNames = [...toLoad.keys(), ...toLoadShared.keys()].join(
          ", "
        ),
        releaseLock = yield acquirePackageLock();
      try {
        messageCallback(`Loading ${packageNames}`);
        const sharedLibraryLoadPromises = {},
          packageLoadPromises = {};
        for (const [name, channel] of toLoadShared)
          loadedPackages[name]
            ? toLoadShared.delete(name)
            : (sharedLibraryLoadPromises[name] = downloadPackage(
                name,
                channel
              ));
        for (const [name, channel] of toLoad)
          loadedPackages[name]
            ? toLoad.delete(name)
            : (packageLoadPromises[name] = downloadPackage(name, channel));
        const loaded = [],
          failed = {},
          sharedLibraryInstallPromises = {},
          packageInstallPromises = {};
        for (const [name, channel] of toLoadShared)
          sharedLibraryInstallPromises[name] = sharedLibraryLoadPromises[name]
            .then((buffer) =>
              __awaiter(this, void 0, void 0, function* () {
                yield installPackage(name, buffer),
                  loaded.push(name),
                  (loadedPackages[name] = channel);
              })
            )
            .catch((err) => {
              console.warn(err), (failed[name] = err);
            });
        yield Promise.all(Object.values(sharedLibraryInstallPromises));
        for (const [name, channel] of toLoad)
          packageInstallPromises[name] = packageLoadPromises[name]
            .then((buffer) =>
              __awaiter(this, void 0, void 0, function* () {
                yield installPackage(name, buffer),
                  loaded.push(name),
                  (loadedPackages[name] = channel);
              })
            )
            .catch((err) => {
              console.warn(err), (failed[name] = err);
            });
        if (
          (yield Promise.all(Object.values(packageInstallPromises)),
          Module.reportUndefinedSymbols(),
          loaded.length > 0)
        ) {
          const successNames = loaded.join(", ");
          messageCallback(`Loaded ${successNames}`);
        }
        if (Object.keys(failed).length > 0) {
          const failedNames = Object.keys(failed).join(", ");
          messageCallback(`Failed to load ${failedNames}`);
          for (const [name, err] of Object.entries(failed))
            console.warn(`The following error occurred while loading ${name}:`),
              console.error(err);
        }
        API.importlib.invalidate_caches();
      } finally {
        releaseLock();
      }
    });
  }
  let loadedPackages = {};
  function ensureCaughtObjectIsError(e) {
    if ("string" == typeof e) e = new Error(e);
    else if (
      "object" != typeof e ||
      null === e ||
      "string" != typeof e.stack ||
      "string" != typeof e.message
    ) {
      let msg = `A value of type ${typeof e} with tag ${Object.prototype.toString.call(
        e
      )} was thrown as an error!`;
      try {
        msg += `\nString interpolation of the thrown value gives """${e}""".`;
      } catch (e) {
        msg += "\nString interpolation of the thrown value fails.";
      }
      try {
        msg += `\nThe thrown value's toString method returns """${e.toString()}""".`;
      } catch (e) {
        msg += "\nThe thrown value's toString method fails.";
      }
      e = new Error(msg);
    }
    return e;
  }
  API.dump_traceback = function () {
    Module.__Py_DumpTraceback(1, Module._PyGILState_GetThisThreadState());
  };
  let fatal_error_occurred = !1;
  API.fatal_error = function (e) {
    if (!e || !e.pyodide_fatal_error) {
      if (fatal_error_occurred)
        return (
          console.error("Recursive call to fatal_error. Inner error was:"),
          void console.error(e)
        );
      ((e =
        "number" == typeof e
          ? convertCppException(e)
          : ensureCaughtObjectIsError(e)).pyodide_fatal_error = !0),
        (fatal_error_occurred = !0),
        console.error(
          "Pyodide has suffered a fatal error. Please report this to the Pyodide maintainers."
        ),
        console.error("The cause of the fatal error was:"),
        API.inTestHoist
          ? (console.error(e.toString()), console.error(e.stack))
          : console.error(e);
      try {
        API.dump_traceback();
        for (let key of Object.keys(API.public_api))
          key.startsWith("_") ||
            "version" === key ||
            Object.defineProperty(API.public_api, key, {
              enumerable: !0,
              configurable: !0,
              get: () => {
                throw new Error(
                  "Pyodide already fatally failed and can no longer be used."
                );
              },
            });
        API.on_fatal && API.on_fatal(e);
      } catch (err2) {
        console.error("Another error occurred while handling the fatal error:"),
          console.error(err2);
      }
      throw e;
    }
  };
  class CppException extends Error {
    constructor(ty, msg) {
      super(msg), (this.ty = ty);
    }
  }
  function convertCppException(ptr) {
    const [exc_type_name, is_exception_subclass, adjusted_ptr] = (function (
      ptr
    ) {
      const base_exception_type = Module._exc_type(),
        caught_exception_type = new Module.ExceptionInfo(ptr).get_type(),
        stackTop = Module.stackSave(),
        exceptionThrowBuf = Module.stackAlloc(4);
      Module.HEAP32[exceptionThrowBuf / 4] = ptr;
      const exc_type_name = Module.demangle(
          Module.UTF8ToString(Module._exc_typename(caught_exception_type))
        ),
        is_exception_subclass = !!Module.___cxa_can_catch(
          base_exception_type,
          caught_exception_type,
          exceptionThrowBuf
        ),
        adjusted_ptr = Module.HEAP32[exceptionThrowBuf / 4];
      return (
        Module.stackRestore(stackTop),
        [exc_type_name, is_exception_subclass, adjusted_ptr]
      );
    })(ptr);
    let msg;
    if (is_exception_subclass) {
      const msgPtr = Module._exc_what(adjusted_ptr);
      msg = Module.UTF8ToString(msgPtr);
    } else msg = `The exception is an object of type ${exc_type_name} at address ${ptr} which does not inherit from std::exception`;
    return new CppException(exc_type_name, msg);
  }
  function isPyodideFrame(frame) {
    const fileName = frame.fileName || "";
    if (fileName.includes("pyodide.asm")) return !0;
    if (fileName.includes("wasm-function")) return !0;
    if (!fileName.includes("pyodide.js")) return !1;
    let funcName = frame.functionName || "";
    return (
      funcName.startsWith("Object.") &&
        (funcName = funcName.slice("Object.".length)),
      !(funcName in API.public_api) ||
        "PythonError" === funcName ||
        ((frame.functionName = funcName), !1)
    );
  }
  Object.defineProperty(CppException.prototype, "name", {
    get() {
      return `${this.constructor.name} ${this.ty}`;
    },
  }),
    (Tests.convertCppException = convertCppException),
    (Module.handle_js_error = function (e) {
      if (e && e.pyodide_fatal_error) throw e;
      if (e instanceof Module._PropagatePythonError) return;
      let stack,
        weirdCatch,
        restored_error = !1;
      e instanceof API.PythonError &&
        (restored_error = Module._restore_sys_last_exception(
          e.__error_address
        ));
      try {
        stack = ErrorStackParser.parse(e);
      } catch (_) {
        weirdCatch = !0;
      }
      if ((weirdCatch && (e = ensureCaughtObjectIsError(e)), !restored_error)) {
        let eidx = Hiwire.new_value(e),
          err = Module._JsProxy_create(eidx);
        Module._set_error(err), Module._Py_DecRef(err), Hiwire.decref(eidx);
      }
      if (!weirdCatch) {
        if (
          (function (frame) {
            if (!isPyodideFrame(frame)) return !1;
            const funcName = frame.functionName;
            return "PythonError" === funcName || "new_error" === funcName;
          })(stack[0])
        )
          for (; isPyodideFrame(stack[0]); ) stack.shift();
        for (const frame of stack) {
          if (isPyodideFrame(frame)) break;
          const funcnameAddr = Module.stringToNewUTF8(
              frame.functionName || "???"
            ),
            fileNameAddr = Module.stringToNewUTF8(frame.fileName || "???.js");
          Module.__PyTraceback_Add(
            funcnameAddr,
            fileNameAddr,
            frame.lineNumber
          ),
            Module._free(funcnameAddr),
            Module._free(fileNameAddr);
        }
      }
    });
  class PythonError extends Error {
    constructor(message, error_address) {
      const oldLimit = Error.stackTraceLimit;
      (Error.stackTraceLimit = 1 / 0),
        super(message),
        (Error.stackTraceLimit = oldLimit),
        (this.__error_address = error_address);
    }
  }
  Object.defineProperty(PythonError.prototype, "name", {
    value: PythonError.name,
  }),
    (API.PythonError = PythonError);
  class _PropagatePythonError extends Error {
    constructor() {
      (API.fail_test = !0),
        super(
          "If you are seeing this message, an internal Pyodide error has occurred. Please report it to the Pyodide maintainers."
        );
    }
  }
  Object.defineProperty(_PropagatePythonError.prototype, "name", {
    value: _PropagatePythonError.name,
  }),
    (Module._PropagatePythonError = _PropagatePythonError);
  let runPythonPositionalGlobalsDeprecationWarned = !1;
  function runPython(code, options = {}) {
    return (
      API.isPyProxy(options) &&
        ((options = { globals: options }),
        runPythonPositionalGlobalsDeprecationWarned ||
          (console.warn(
            "Passing a PyProxy as the second argument to runPython is deprecated and will be removed in v0.21. Use 'runPython(code, {globals : some_dict})' instead."
          ),
          (runPythonPositionalGlobalsDeprecationWarned = !0))),
      options.globals || (options.globals = API.globals),
      API.pyodide_py.eval_code(code, options.globals)
    );
  }
  function loadPackagesFromImports(code, messageCallback, errorCallback) {
    return __awaiter(this, void 0, void 0, function* () {
      let imports,
        pyimports = API.pyodide_py.find_imports(code);
      try {
        imports = pyimports.toJs();
      } finally {
        pyimports.destroy();
      }
      if (0 === imports.length) return;
      let packageNames = API._import_name_to_package_name,
        packages = new Set();
      for (let name of imports)
        packageNames.has(name) && packages.add(packageNames.get(name));
      packages.size &&
        (yield loadPackage(
          Array.from(packages),
          messageCallback,
          errorCallback
        ));
    });
  }
  function runPythonAsync(code, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
      return (
        API.isPyProxy(options) &&
          ((options = { globals: options }),
          runPythonPositionalGlobalsDeprecationWarned ||
            (console.warn(
              "Passing a PyProxy as the second argument to runPythonAsync is deprecated and will be removed in v0.21. Use 'runPythonAsync(code, {globals : some_dict})' instead."
            ),
            (runPythonPositionalGlobalsDeprecationWarned = !0))),
        options.globals || (options.globals = API.globals),
        yield API.pyodide_py.eval_code_async(code, options.globals)
      );
    });
  }
  function registerJsModule(name, module) {
    API.pyodide_py.register_js_module(name, module);
  }
  function registerComlink(Comlink) {
    API._Comlink = Comlink;
  }
  function unregisterJsModule(name) {
    API.pyodide_py.unregister_js_module(name);
  }
  function toPy(
    obj,
    { depth: depth, defaultConverter: defaultConverter } = { depth: -1 }
  ) {
    switch (typeof obj) {
      case "string":
      case "number":
      case "boolean":
      case "bigint":
      case "undefined":
        return obj;
    }
    if (!obj || API.isPyProxy(obj)) return obj;
    let obj_id = 0,
      py_result = 0,
      result = 0;
    try {
      obj_id = Hiwire.new_value(obj);
      try {
        py_result = Module.js2python_convert(obj_id, {
          depth: depth,
          defaultConverter: defaultConverter,
        });
      } catch (e) {
        throw (
          (e instanceof Module._PropagatePythonError && Module._pythonexc2js(),
          e)
        );
      }
      if (Module._JsProxy_Check(py_result)) return obj;
      (result = Module._python2js(py_result)),
        0 === result && Module._pythonexc2js();
    } finally {
      Hiwire.decref(obj_id), Module._Py_DecRef(py_result);
    }
    return Hiwire.pop_value(result);
  }
  function pyimport(mod_name) {
    return API.importlib.import_module(mod_name);
  }
  (API.runPython = runPython), (API.runPythonAsync = runPythonAsync);
  let FS,
    runPythonInternal_dict,
    unpackArchivePositionalExtractDirDeprecationWarned = !1;
  function unpackArchive(buffer, format, options = {}) {
    "string" == typeof options &&
      (unpackArchivePositionalExtractDirDeprecationWarned ||
        (console.warn(
          "Passing a string as the third argument to unpackArchive is deprecated and will be removed in v0.21. Instead use { extract_dir : 'some_path' }"
        ),
        (unpackArchivePositionalExtractDirDeprecationWarned = !0)),
      (options = { extractDir: options }));
    let extract_dir = options.extractDir;
    API.package_loader.unpack_buffer.callKwargs({
      buffer: buffer,
      format: format,
      extract_dir: extract_dir,
    });
  }
  function setInterruptBuffer(interrupt_buffer) {
    (Module.HEAP8[Module._Py_EMSCRIPTEN_SIGNAL_HANDLING] = !!interrupt_buffer),
      (Module.Py_EmscriptenSignalBuffer = interrupt_buffer);
  }
  function checkInterrupt() {
    Module.__PyErr_CheckSignals() && Module._pythonexc2js();
  }
  function makePublicAPI() {
    FS = Module.FS;
    let namespace = {
      globals: undefined,
      FS: FS,
      pyodide_py: undefined,
      version: "",
      loadPackage: loadPackage,
      loadPackagesFromImports: loadPackagesFromImports,
      loadedPackages: loadedPackages,
      isPyProxy: isPyProxy,
      runPython: runPython,
      runPythonAsync: runPythonAsync,
      registerJsModule: registerJsModule,
      unregisterJsModule: unregisterJsModule,
      setInterruptBuffer: setInterruptBuffer,
      checkInterrupt: checkInterrupt,
      toPy: toPy,
      pyimport: pyimport,
      unpackArchive: unpackArchive,
      registerComlink: registerComlink,
      PythonError: PythonError,
      PyBuffer: PyBuffer,
      _module: Module,
      _api: API,
    };
    return (API.public_api = namespace), namespace;
  }
  function finalizeBootstrap(config) {
    (runPythonInternal_dict = API._pyodide._base.eval_code("{}")),
      (API.importlib = API.runPythonInternal("import importlib; importlib"));
    let import_module = API.importlib.import_module;
    (API.sys = import_module("sys")), API.sys.path.insert(0, config.homedir);
    let globals = API.runPythonInternal("import __main__; __main__.__dict__"),
      builtins = API.runPythonInternal("import builtins; builtins.__dict__");
    var builtins_dict;
    API.globals =
      ((builtins_dict = builtins),
      new Proxy(globals, {
        get: (target, symbol) =>
          "get" === symbol
            ? (key) => {
                let result = target.get(key);
                return (
                  void 0 === result && (result = builtins_dict.get(key)), result
                );
              }
            : "has" === symbol
            ? (key) => target.has(key) || builtins_dict.has(key)
            : Reflect.get(target, symbol),
      }));
    let importhook = API._pyodide._importhook;
    importhook.register_js_finder(),
      importhook.register_js_module("js", config.jsglobals);
    let pyodide = makePublicAPI();
    return (
      importhook.register_js_module("pyodide_js", pyodide),
      (API.pyodide_py = import_module("pyodide")),
      (API.package_loader = import_module("pyodide._package_loader")),
      (API.version = API.pyodide_py.__version__),
      (pyodide.pyodide_py = API.pyodide_py),
      (pyodide.version = API.version),
      (pyodide.globals = API.globals),
      pyodide
    );
  }
  function loadPyodide(options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
      if (loadPyodide.inProgress)
        throw new Error("Pyodide is already loading.");
      options.indexURL ||
        (options.indexURL = (function () {
          let err;
          try {
            throw new Error();
          } catch (e) {
            err = e;
          }
          const fileName = ErrorStackParser.parse(err)[0].fileName;
          return fileName.slice(0, fileName.lastIndexOf("/"));
        })()),
        (loadPyodide.inProgress = !0);
      const default_config = {
        fullStdLib: !0,
        jsglobals: globalThis,
        stdin: globalThis.prompt ? globalThis.prompt : void 0,
        homedir: "/home/pyodide",
      };
      let config = Object.assign(default_config, options);
      config.indexURL.endsWith("/") || (config.indexURL += "/"),
        yield (function () {
          return __awaiter(this, void 0, void 0, function* () {
            IN_NODE &&
              ((nodePathMod = (yield import("path")).default),
              (nodeFsPromisesMod = yield import("fs/promises")),
              (nodeFetch = (yield import("node-fetch")).default),
              (nodeVmMod = (yield import("vm")).default));
          });
        })();
      let packageIndexReady = (function (indexURL) {
          return __awaiter(this, void 0, void 0, function* () {
            let package_json;
            if (((baseURL = indexURL), IN_NODE)) {
              const package_string = yield nodeFsPromisesMod.readFile(
                `${indexURL}packages.json`
              );
              package_json = JSON.parse(package_string);
            } else {
              let response = yield fetch(`${indexURL}packages.json`);
              package_json = yield response.json();
            }
            if (!package_json.packages)
              throw new Error(
                "Loaded packages.json does not contain the expected key 'packages'."
              );
            (API.packages = package_json.packages),
              (API._import_name_to_package_name = new Map());
            for (let name of Object.keys(API.packages))
              for (let import_name of API.packages[name].imports)
                API._import_name_to_package_name.set(import_name, name);
          });
        })(config.indexURL),
        pyodide_py_tar_promise = _loadBinaryFile(
          config.indexURL,
          "pyodide_py.tar"
        );
      var path;
      setStandardStreams(config.stdin, config.stdout, config.stderr),
        (path = config.homedir),
        Module.preRun.push(function () {
          try {
            Module.FS.mkdirTree(path);
          } catch (e) {
            console.error(
              `Error occurred while making a home directory '${path}':`
            ),
              console.error(e),
              console.error("Using '/' for a home directory instead"),
              (path = "/");
          }
          (Module.ENV.HOME = path), Module.FS.chdir(path);
        });
      let moduleLoaded = new Promise((r) => (Module.postRun = r));
      Module.locateFile = (path) => config.indexURL + path;
      const scriptSrc = `${config.indexURL}pyodide.asm.js`;
      yield loadScript(scriptSrc),
        yield _createPyodideModule(Module),
        yield moduleLoaded,
        (Module.locateFile = (path) => {
          throw new Error(
            "Didn't expect to load any more file_packager files!"
          );
        });
      !(function (pyodide_py_tar) {
        let stream = Module.FS.open("/pyodide_py.tar", "w");
        Module.FS.write(
          stream,
          pyodide_py_tar,
          0,
          pyodide_py_tar.byteLength,
          void 0,
          !0
        ),
          Module.FS.close(stream);
        const code_ptr = Module.stringToNewUTF8(
          '\nfrom sys import version_info\npyversion = f"python{version_info.major}.{version_info.minor}"\nimport shutil\nshutil.unpack_archive("/pyodide_py.tar", f"/lib/{pyversion}/site-packages/")\ndel shutil\nimport importlib\nimportlib.invalidate_caches()\ndel importlib\n    '
        );
        if (Module._PyRun_SimpleString(code_ptr)) throw new Error("OOPS!");
        Module._free(code_ptr), Module.FS.unlink("/pyodide_py.tar");
      })(yield pyodide_py_tar_promise),
        Module._pyodide_init();
      let pyodide = finalizeBootstrap(config);
      return (
        yield packageIndexReady,
        config.fullStdLib && (yield loadPackage(["distutils"])),
        pyodide.runPython("print('Python initialization complete')"),
        pyodide
      );
    });
  }
  (API.saveState = () => API.pyodide_py._state.save_state()),
    (API.restoreState = (state) => API.pyodide_py._state.restore_state(state)),
    (API.runPythonInternal = function (code) {
      return API._pyodide._base.eval_code(code, runPythonInternal_dict);
    }),
    (globalThis.loadPyodide = loadPyodide),
    (exports.loadPyodide = loadPyodide),
    Object.defineProperty(exports, "__esModule", { value: !0 });
});
//# sourceMappingURL=pyodide.js.map
