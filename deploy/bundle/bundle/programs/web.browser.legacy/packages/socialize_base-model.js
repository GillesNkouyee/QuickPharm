//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
// Source maps are supported by all recent versions of Chrome, Safari,  //
// and Firefox, and by Internet Explorer 11.                            //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var Mongo = Package.mongo.Mongo;
var _ = Package.underscore._;
var ServerTime = Package['socialize:server-time'].ServerTime;
var SimpleSchema = Package['aldeed:simple-schema'].SimpleSchema;
var MongoObject = Package['aldeed:simple-schema'].MongoObject;
var CollectionHooks = Package['matb33:collection-hooks'].CollectionHooks;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var Collection2 = Package['aldeed:collection2-core'].Collection2;
var Symbol = Package['ecmascript-runtime-client'].Symbol;
var Map = Package['ecmascript-runtime-client'].Map;
var Set = Package['ecmascript-runtime-client'].Set;

var require = meteorInstall({"node_modules":{"meteor":{"socialize:base-model":{"base-model.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// packages/socialize_base-model/base-model.js                                                                 //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
module.export({
  BaseModel: function () {
    return BaseModel;
  }
});

var _;

module.watch(require("meteor/underscore"), {
  _: function (v) {
    _ = v;
  }
}, 0);
var Meteor;
module.watch(require("meteor/meteor"), {
  Meteor: function (v) {
    Meteor = v;
  }
}, 1);
var SimpleSchema;
module.watch(require("meteor/aldeed:simple-schema"), {
  SimpleSchema: function (v) {
    SimpleSchema = v;
  }
}, 2);
var diff;
module.watch(require("rus-diff"), {
  diff: function (v) {
    diff = v;
  }
}, 3);
module.watch(require("./security.js"));

function extend(reciever, provider) {
  for (var prop in meteorBabelHelpers.sanitizeForInObject(provider)) {
    if (provider.hasOwnProperty(prop)) {
      reciever[prop] = provider[prop];
    }
  }
}

var BaseModel =
/*#__PURE__*/
function () {
  function BaseModel(document, preClean) {
    document = document || {};

    if (preClean) {
      document = this._getSchema().clean(document);
    }

    extend(this, document);
    this._document = document;
  }

  BaseModel.createEmpty = function () {
    function createEmpty(_id) {
      return new this({
        _id: _id
      });
    }

    return createEmpty;
  }();

  BaseModel.methods = function () {
    function methods(methodMap) {
      var self = this;

      if (_.isObject(methodMap)) {
        _.each(methodMap, function (method, name) {
          if (_.isFunction(method)) {
            if (!self.prototype[name]) {
              self.prototype[name] = method;
            } else {
              throw new Meteor.Error("existent-method", "The method " + name + " already exists.");
            }
          }
        });
      }
    }

    return methods;
  }();

  BaseModel.updateTransformFunction = function () {
    function updateTransformFunction() {
      var _this = this;

      this.prototype.getCollection()._transform = function (document) {
        return new _this(document);
      };
    }

    return updateTransformFunction;
  }();

  BaseModel.attachCollection = function () {
    function attachCollection(collection) {
      var transform = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      this.prototype.getCollection = function () {
        return collection;
      };

      Meteor[collection._name] = collection;

      if (transform) {
        this.updateTransformFunction();
      }
    }

    return attachCollection;
  }();

  BaseModel.appendSchema = function () {
    function appendSchema(schemaObject) {
      var schema = new SimpleSchema(schemaObject);
      var collection = this.prototype.getCollection();

      if (collection) {
        collection.attachSchema(schema);
      } else {
        throw new Error("Can't append schema to non existent collection. Please use extendAndSetupCollection() to create your models");
      }
    }

    return appendSchema;
  }();

  var _proto = BaseModel.prototype;

  _proto._getSchema = function () {
    function _getSchema() {
      var schema = Meteor._get(this.getCollection(), "_c2", "_simpleSchema");

      if (schema) {
        return schema;
      } else {
        throw new Meteor.Error("noSchema", "You don't have a schema defined for " + this.getCollectionName());
      }
    }

    return _getSchema;
  }();

  _proto.getCollection = function () {
    function getCollection() {
      //We just throw here. This method is reassigned in attachCollection method when collection is attached.
      throw new Meteor.Error("noCollection", "You must use ClassName.attachCollection to attach a collection to your model.");
    }

    return getCollection;
  }();

  _proto.getCollectionName = function () {
    function getCollectionName() {
      return this.getCollection()._name;
    }

    return getCollectionName;
  }(); // get all values from the model that do not have a denyUpdate or denyUntrusted in their schema


  _proto.getUpdatableFields = function () {
    function getUpdatableFields() {
      var schema = this._getSchema()._schema;

      var fields = {
        _id: this._id
      };

      var _arr = Object.keys(this);

      for (var _i = 0; _i < _arr.length; _i++) {
        var key = _arr[_i];

        if (schema[key] && !(schema[key].custom && schema[key].custom === SimpleSchema.denyUntrusted) && !schema[key].denyUdate) {
          fields[key] = this[key];
        }
      }

      return fields;
    }

    return getUpdatableFields;
  }();

  _proto.checkOwnership = function () {
    function checkOwnership() {
      return this.userId === Meteor.userId();
    }

    return checkOwnership;
  }();

  _proto.save = function () {
    function save(callback) {
      var _this2 = this;

      var schema = this._getSchema();

      var obj = Object.keys(this).filter(function (key) {
        return key !== "_document";
      }).reduce(function (accumulator, key) {
        accumulator[key] = _this2[key];
        return accumulator;
      }, {});

      if (this._id) {
        var updateDiff = diff(this._document, obj);

        if (!_.isEmpty(updateDiff)) {
          this.update(updateDiff, callback);
        } else {
          callback && callback(null);
        }
      } else {
        if (Meteor.isClient && schema) {
          obj = schema.clean(obj);
        }

        this._id = this.getCollection().insert(obj, callback);
      }

      return this;
    }

    return save;
  }();

  _proto.update = function () {
    function update(modifier, callback) {
      if (this._id) {
        this.getCollection().update(this._id, modifier, callback);
      }
    }

    return update;
  }();

  _proto._setProps = function () {
    function _setProps(key, value, validationPathOnly) {
      var current;
      var level = this;
      var steps = key.split(".");
      var last = steps.pop();
      var set = {};
      var currentSet = set;

      while (current = steps.shift()) {
        if (!validationPathOnly) {
          if (level[current]) {
            if (!_.isObject(level[current])) {
              throw new Meteor.Error("PropertyNotObject", current + " of " + key + " is not an object");
            }
          } else {
            level[current] = {};
          }

          level = level[current];
        }

        currentSet = currentSet[current] = {};
      }

      if (!validationPathOnly) {
        level[last] = value;
      }

      currentSet[last] = value;
      return set;
    }

    return _setProps;
  }();

  _proto._updateLocal = function () {
    function _updateLocal(modifier) {
      this.getCollection()._collection.update(this._id, modifier);
    }

    return _updateLocal;
  }();

  _proto.set = function () {
    function set(key, value) {
      var context = this._getSchema().newContext();

      var obj = {};
      obj.$set = this._setProps(key, value, true);

      if (context.validate(obj, {
        modifier: true
      })) {
        obj.$set = this._setProps(key, value);
        this[key] = value;

        if (Meteor.isClient) {
          this._id && this._updateLocal(obj);
        }
      } else {
        throw new Meteor.Error(context.keyErrorMessage(key));
      }

      return this;
    }

    return set;
  }();

  _proto.remove = function () {
    function remove(callback) {
      if (this._id) {
        this.getCollection().remove({
          _id: this._id
        }, callback);
      }
    }

    return remove;
  }();

  return BaseModel;
}();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"security.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// packages/socialize_base-model/security.js                                                                   //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
var SimpleSchema;
module.watch(require("meteor/aldeed:simple-schema"), {
  SimpleSchema: function (v) {
    SimpleSchema = v;
  }
}, 0);
SimpleSchema.messages({
  Untrusted: "Inserts/Updates from untrusted code not supported"
});

SimpleSchema.denyUntrusted = function () {
  if (this.isSet) {
    var autoValue = this.definition.autoValue && this.definition.autoValue.call(this);
    var defaultValue = this.definition.defaultValue;

    if (this.value != defaultValue && this.value != autoValue && !this.isFromTrustedCode) {
      return "Untrusted";
    }
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"node_modules":{"rus-diff":{"package.json":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// node_modules/meteor/socialize_base-model/node_modules/rus-diff/package.json                                 //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
exports.name = "rus-diff";
exports.version = "1.1.0";
exports.main = "lib/index.js";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"index.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// node_modules/meteor/socialize_base-model/node_modules/rus-diff/lib/index.js                                 //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
(function() {
  var apply, arrize, clone, diff, digest, isPlainObject, isRealNumber, resolve,
    slice = [].slice;

  digest = require('json-hash').digest;

  isRealNumber = function() {
    var args;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return args.every(function(e) {
      return (typeof e === 'number') && (isNaN(e) === false) && (e !== +Infinity) && (e !== -Infinity);
    });
  };

  isPlainObject = function(a) {
    return a !== null && typeof a === 'object' && a.constructor === Object;
  };

  diff = function(a, b, stack, options, top, garbage) {
    var aI, aKey, aKeys, aN, aVal, bI, bKey, bKeys, bN, bVal, collect, delta, e, h, incA, j, k, k2, key, len, ref, setB, unsetA, v, v2;
    if (stack == null) {
      stack = [];
    }
    if (options == null) {
      options = {};
    }
    if (top == null) {
      top = true;
    }
    if (garbage == null) {
      garbage = {};
    }
    stack = arrize(stack);
    aKeys = Object.keys(a).sort();
    bKeys = Object.keys(b).sort();
    aN = aKeys.length;
    bN = bKeys.length;
    aI = 0;
    bI = 0;
    delta = {
      $rename: {},
      $unset: {},
      $set: {},
      $inc: {}
    };
    unsetA = function(i) {
      var h, key;
      key = (stack.concat(aKeys[i])).join('.');
      delta.$unset[key] = true;
      h = digest(a[aKeys[i]]);
      return (garbage[h] || (garbage[h] = [])).push(key);
    };
    setB = function(i) {
      var key;
      key = (stack.concat(bKeys[i])).join('.');
      return delta.$set[key] = b[bKeys[i]];
    };
    incA = function(i, d) {
      var key;
      key = (stack.concat(aKeys[i])).join('.');
      return delta.$inc[key] = d;
    };
    while ((aI < aN) && (bI < bN)) {
      aKey = aKeys[aI];
      bKey = bKeys[bI];
      if (aKey === bKey) {
        aVal = a[aKey];
        bVal = b[bKey];
        switch (false) {
          case aVal !== bVal:
            void 0;
            break;
          case !(((aVal != null) && (bVal == null)) || ((aVal == null) && (bVal != null))):
            setB(bI);
            break;
          case !((aVal instanceof Date) && (bVal instanceof Date)):
            if (+aVal !== +bVal) {
              setB(bI);
            }
            break;
          case !((aVal instanceof RegExp) && (bVal instanceof RegExp)):
            if (("" + aVal) !== ("" + bVal)) {
              setB(bI);
            }
            break;
          case !(isPlainObject(aVal) && isPlainObject(bVal)):
            ref = diff(aVal, bVal, stack.concat([aKey]), options, false, garbage);
            for (k in ref) {
              v = ref[k];
              for (k2 in v) {
                v2 = v[k2];
                delta[k][k2] = v2;
              }
            }
            break;
          case !(!isPlainObject(aVal) && !isPlainObject(bVal) && digest(aVal) === digest(bVal)):
            void 0;
            break;
          default:
            if ((options.inc === true) && isRealNumber(aVal, bVal)) {
              incA(aI, bVal - aVal);
            } else {
              setB(bI);
            }
        }
        ++aI;
        ++bI;
      } else {
        if (aKey < bKey) {
          unsetA(aI);
          ++aI;
        } else {
          setB(bI);
          ++bI;
        }
      }
    }
    while (aI < aN) {
      unsetA(aI++);
    }
    while (bI < bN) {
      setB(bI++);
    }
    if (top) {
      collect = (function() {
        var ref1, results;
        ref1 = delta.$set;
        results = [];
        for (k in ref1) {
          v = ref1[k];
          if ((h = digest(v), (garbage[h] != null) && (key = garbage[h].pop()))) {
            results.push([k, key]);
          }
        }
        return results;
      })();
      for (j = 0, len = collect.length; j < len; j++) {
        e = collect[j];
        k = e[0], key = e[1];
        delta.$rename[key] = k;
        delete delta.$unset[key];
        delete delta.$set[k];
      }
    }
    for (k in delta) {
      if (Object.keys(delta[k]).length === 0) {
        delete delta[k];
      }
    }
    if (Object.keys(delta).length === 0) {
      delta = false;
    }
    return delta;
  };

  clone = function(a) {
    var b, f, k, v;
    switch (false) {
      case !((a == null) || (typeof a !== 'object')):
        return a;
      case !(a instanceof Date):
        return new Date(a.getTime());
      case !(a instanceof RegExp):
        f = '';
        if (a.global != null) {
          f += 'g';
        }
        if (a.ignoreCase != null) {
          f += 'i';
        }
        if (a.multiline != null) {
          f += 'm';
        }
        if (a.sticky != null) {
          f += 'y';
        }
        return new RegExp(a.source, f);
      default:
        b = new a.constructor;
        for (k in a) {
          v = a[k];
          b[k] = clone(v);
        }
        return b;
    }
  };

  arrize = function(path, glue) {
    if (glue == null) {
      glue = '.';
    }
    return ((function() {
      if (Array.isArray(path)) {
        return path.slice(0);
      } else {
        switch (path) {
          case void 0:
          case null:
          case false:
          case '':
            return [];
          default:
            return path.toString().split(glue);
        }
      }
    })()).map(function(e) {
      switch (e) {
        case void 0:
        case null:
        case false:
        case '':
          return null;
        default:
          return e.toString();
      }
    }).filter(function(e) {
      return e != null;
    });
  };

  resolve = function(a, path, options) {
    var e, k, last, stack;
    if (options == null) {
      options = {};
    }
    stack = arrize(path);
    last = [];
    if (stack.length > 0) {
      last.unshift(stack.pop());
    }
    e = a;
    if (e !== null) {
      while ((k = stack.shift()) !== void 0) {
        if (e[k] !== void 0) {
          e = e[k];
        } else {
          stack.unshift(k);
          break;
        }
      }
    }
    if (options.force) {
      while ((k = stack.shift()) !== void 0) {
        if ((typeof stack[0] === 'number') || ((stack.length === 0) && (typeof last[0] === 'number'))) {
          e[k] = [];
        } else {
          e[k] = {};
        }
        e = e[k];
      }
    } else {
      while ((k = stack.pop()) !== void 0) {
        last.unshift(k);
      }
    }
    return [e, last];
  };

  apply = function(a, delta) {
    var k, n, n1, n2, name, o, o1, o2, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, v;
    if (delta != null) {
      if (delta.$rename != null) {
        ref = delta.$rename;
        for (k in ref) {
          v = ref[k];
          ref1 = resolve(a, k), o1 = ref1[0], n1 = ref1[1];
          ref2 = resolve(a, v), o2 = ref2[0], n2 = ref2[1];
          if ((o1 != null) && n1.length === 1) {
            if ((o2 != null) && n2.length === 1) {
              o2[n2[0]] = o1[n1[0]];
              delete o1[n1[0]];
            } else {
              throw new Error(o2 + "/" + n2 + " - couldn't resolve first for " + a + " " + v);
            }
          } else {
            throw new Error(o1 + "/" + n1 + " - couldn't resolve second for " + a + " " + k);
          }
        }
      }
      if (delta.$set != null) {
        ref3 = delta.$set;
        for (k in ref3) {
          v = ref3[k];
          ref4 = resolve(a, k, {
            force: true
          }), o = ref4[0], n = ref4[1];
          if ((o != null) && n.length === 1) {
            o[n[0]] = v;
          } else {
            throw new Error(o + "/" + n + " - couldn't set for " + a + " " + k);
          }
        }
      }
      if (delta.$inc != null) {
        ref5 = delta.$inc;
        for (k in ref5) {
          v = ref5[k];
          ref6 = resolve(a, k, {
            force: true
          }), o = ref6[0], n = ref6[1];
          if ((o != null) && n.length === 1) {
            if (o[name = n[0]] == null) {
              o[name] = 0;
            }
            o[n[0]] += v;
          } else {
            throw new Error(o + "/" + n + " - couldn't set for " + a + " " + k);
          }
        }
      }
      if (delta.$unset != null) {
        ref7 = delta.$unset;
        for (k in ref7) {
          v = ref7[k];
          ref8 = resolve(a, k), o = ref8[0], n = ref8[1];
          if ((o != null) && n.length === 1) {
            delete o[n[0]];
          } else {
            throw new Error(o + "/" + n + " - couldn't unset for " + a + " " + k);
          }
        }
      }
    }
    return a;
  };

  module.exports = {
    apply: apply,
    arrize: arrize,
    clone: clone,
    diff: diff,
    isRealNumber: isRealNumber,
    resolve: resolve,
    rusDiff: diff
  };

}).call(this);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"json-hash":{"package.json":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// node_modules/meteor/socialize_base-model/node_modules/json-hash/package.json                                //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
exports.name = "json-hash";
exports.version = "1.2.0";
exports.browser = "lib/browser.js";
exports.main = "lib/index.js";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"browser.js":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// node_modules/meteor/socialize_base-model/node_modules/json-hash/lib/browser.js                              //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

exports.digest = digest;

var digest_ = require("./digest").digest;

var crypto_ = _interopRequire(require("./crypto"));

function digest(a) {
  var _ref = arguments[1] === undefined ? {} : arguments[1];

  var _ref$algorithm = _ref.algorithm;
  var algorithm = _ref$algorithm === undefined ? "sha1" : _ref$algorithm;
  var _ref$inputEncoding = _ref.inputEncoding;
  var inputEncoding = _ref$inputEncoding === undefined ? "utf8" : _ref$inputEncoding;
  var _ref$outputEncoding = _ref.outputEncoding;
  var outputEncoding = _ref$outputEncoding === undefined ? "hex" : _ref$outputEncoding;
  var _ref$crypto = _ref.crypto;
  var crypto = _ref$crypto === undefined ? crypto_ : _ref$crypto;
  var sets = _ref.sets;

  return digest_(a, { algorithm: algorithm, inputEncoding: inputEncoding, outputEncoding: outputEncoding, crypto: crypto, sets: sets });
}
Object.defineProperty(exports, "__esModule", {
  value: true
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"digest.js":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// node_modules/meteor/socialize_base-model/node_modules/json-hash/lib/digest.js                               //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
"use strict";

// Compute digest for JSON object.
exports.digest = digest;
function digest(a) {
  var _ref = arguments[1] === undefined ? {} : arguments[1];

  var _ref$algorithm = _ref.algorithm;
  var algorithm = _ref$algorithm === undefined ? "sha1" : _ref$algorithm;
  var _ref$inputEncoding = _ref.inputEncoding;
  var inputEncoding = _ref$inputEncoding === undefined ? "utf8" : _ref$inputEncoding;
  var _ref$outputEncoding = _ref.outputEncoding;
  var outputEncoding = _ref$outputEncoding === undefined ? "hex" : _ref$outputEncoding;
  var crypto = _ref.crypto;
  var sets = _ref.sets;

  var h = crypto.createHash(algorithm);
  var u = function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return h.update(args.join(":"), inputEncoding);
  };
  var d = function (a) {
    return digest(a, { algorithm: algorithm, inputEncoding: inputEncoding, outputEncoding: outputEncoding, crypto: crypto, sets: sets });
  };
  switch (true) {

    // undefined
    case typeof a === "undefined":
      u("u");
      break;

    // null
    case a === null:
      u("n");
      break;

    // boolean
    case typeof a === "boolean":
    case a instanceof Boolean:
      u("f", a.valueOf());
      break;

    // number
    case typeof a === "number":
    case a instanceof Number:
      u("i", "" + a);
      break;

    // string
    case typeof a === "string":
    case a instanceof String:
      u("s", "" + a);
      break;

    // symbol
    case typeof a === "symbol":
    case a instanceof Symbol:
      u("S", "" + a);
      break;

    // date
    case a instanceof Date:
      u("d", a.toISOString());
      break;

    // regexp
    case a instanceof RegExp:
      u("x", "" + a);
      break;

    // function
    case a instanceof Function:
      u("F", a.toString());
      break;

    // array
    case Array.isArray(a):
      if (sets) {
        u("<");
        a.map(d).sort().forEach(function (e) {
          return u("A", e);
        });
        u(">");
      } else {
        u("[");
        a.forEach(function (e) {
          return u("a", d(e));
        });
        u("]");
      }
      break;

    // object
    default:
      u("{");
      Object.keys(a).sort().forEach(function (k) {
        return u("k", d(k), "v", d(a[k]));
      });
      u("}");
      break;
  }
  return h.digest(outputEncoding);
}
Object.defineProperty(exports, "__esModule", {
  value: true
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"crypto.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// node_modules/meteor/socialize_base-model/node_modules/json-hash/lib/crypto.js                               //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
"use strict";

// var INPUT_ENCODINGS = [ 'binary', 'ascii', 'utf8' ]
// var OUTPUT_ENCODINGS = [ 'binary', 'hex', 'base64' ]

function N(r, a, enc) {
  if (Array.isArray(a)) {
    var n = a.length;
    for (var i = 0; i < n; i++) {
      r.push(a[i]);
    }
  } else {
    if (enc === "utf8") {
      var b = unescape(encodeURIComponent(a));
      var n = b.length;
      for (var i = 0; i < n; i++) {
        r.push(b.charCodeAt(i));
      }
    } else {
      var n = a.length;
      for (var i = 0; i < n; i++) {
        var c = a.charCodeAt(i) & 255;
        r.push(c === 0 && enc === "ascii" ? 32 : c);
      }
    }
  }
}

var O = function O(a, c) {
  var r = null;
  var s = function s(e) {
    return String.fromCharCode(e);
  };
  var h = function h(e) {
    return e.toString(16);
  };
  switch (c) {
    case "binary":
      r = a.map(s).join("");break;
    case "base64":
      r = atob(a.map(s).join(""));break;
    default:
      r = a.map(h).join("");break;
  }
  return r;
};

var R = function R(n, s) {
  return n << s | n >>> 32 - s;
};

function SHA1(w) {

  var n = w.length;
  var M = 4294967295;
  var W = new Array(80);
  var H = [1732584193, 4023233417, 2562383102, 271733878, 3285377520];

  for (var b = 0; b < w.length; b += 16) {
    var A = H[0],
        B = H[1],
        C = H[2],
        D = H[3],
        E = H[4];

    for (var i = 0; i < 16; i++) {
      W[i] = w[b + i];
    }

    for (var i = 16; i <= 79; i++) {
      W[i] = R(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
    }

    for (var i = 0; i <= 19; i++) {
      var t = R(A, 5) + (B & C | ~B & D) + E + W[i] + 1518500249 & M;
      E = D;D = C;C = R(B, 30);B = A;A = t;
    }

    for (var i = 20; i <= 39; i++) {
      var t = R(A, 5) + (B ^ C ^ D) + E + W[i] + 1859775393 & M;
      E = D;D = C;C = R(B, 30);B = A;A = t;
    }

    for (var i = 40; i <= 59; i++) {
      var t = R(A, 5) + (B & C | B & D | C & D) + E + W[i] + 2400959708 & M;
      E = D;D = C;C = R(B, 30);B = A;A = t;
    }

    for (var i = 60; i <= 79; i++) {
      var t = R(A, 5) + (B ^ C ^ D) + E + W[i] + 3395469782 & M;
      E = D;D = C;C = R(B, 30);B = A;A = t;
    }

    H[0] = H[0] + A & M;
    H[1] = H[1] + B & M;
    H[2] = H[2] + C & M;
    H[3] = H[3] + D & M;
    H[4] = H[4] + E & M;
  }

  return H;
}

function createHash(algorithm) {
  var r = null;
  switch (algorithm) {

    // We support SHA1 only for now.
    case "sha1":
      r = createHashSHA1(algorithm);
      break;

    default:
      throw new Error("Digest method not supported.");
  }
  return r;
}

function createHashSHA1() {
  var m = 0;
  var c = [];
  var r = [];
  return {
    update: function update(a, e) {
      N(c, a, e);
    },
    digest: function digest(outputEncoding) {

      var n = c.length;
      for (var i = 0; i < n - 3; i += 4) {
        r.push(c[i] << 24 | c[i + 1] << 16 | c[i + 2] << 8 | c[i + 3]);
      }

      switch (n % 4) {
        case 0:
          r.push(2147483648);break;
        case 1:
          r.push(c[n - 1] << 24 | 8388608);break;
        case 2:
          r.push(c[n - 2] << 24 | c[n - 1] << 16 | 32768);break;
        case 3:
          r.push(c[n - 3] << 24 | c[n - 2] << 16 | c[n - 1] << 8 | 128);break;
      }
      while (r.length % 16 != 14) {
        r.push(0);
      }
      r.push(n >>> 29);
      r.push(n << 3 & 4294967295);

      // r.map(
      //   function (a) {
      //     var r = []
      //     for (var i = 7; i >= 0; --i) {
      //       r.push(((a >>> (i * 4)) & 0x0f).toString(16))
      //     }
      //     return r.join('')
      //   }
      // ).join('')

      return O(SHA1(r).reduce(function (r, a) {
        for (var i = 7; i >= 0; --i) {
          r.push(a >>> i * 4 & 15);
        }
        return r;
      }, []), outputEncoding);
    }
  };
}

// if (!module.parent) {
//   var h = createHashSHA1()
//   h.update('hello')
//   console.log(h.digest('hex'))
// }

module.exports = {
  createHash: createHash
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
var exports = require("/node_modules/meteor/socialize:base-model/base-model.js");

/* Exports */
Package._define("socialize:base-model", exports);

})();
