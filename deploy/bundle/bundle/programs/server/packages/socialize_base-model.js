(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var _ = Package.underscore._;
var ECMAScript = Package.ecmascript.ECMAScript;
var ServerTime = Package['socialize:server-time'].ServerTime;
var SimpleSchema = Package['aldeed:simple-schema'].SimpleSchema;
var MongoObject = Package['aldeed:simple-schema'].MongoObject;
var CollectionHooks = Package['matb33:collection-hooks'].CollectionHooks;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var Collection2 = Package['aldeed:collection2-core'].Collection2;

/* Package-scope variables */
var document;

var require = meteorInstall({"node_modules":{"meteor":{"socialize:base-model":{"base-model.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/socialize_base-model/base-model.js                                                               //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
module.export({
  BaseModel: () => BaseModel
});

let _;

module.watch(require("meteor/underscore"), {
  _(v) {
    _ = v;
  }

}, 0);
let Meteor;
module.watch(require("meteor/meteor"), {
  Meteor(v) {
    Meteor = v;
  }

}, 1);
let SimpleSchema;
module.watch(require("meteor/aldeed:simple-schema"), {
  SimpleSchema(v) {
    SimpleSchema = v;
  }

}, 2);
let diff;
module.watch(require("rus-diff"), {
  diff(v) {
    diff = v;
  }

}, 3);
module.watch(require("./security.js"));

function extend(reciever, provider) {
  for (var prop in provider) {
    if (provider.hasOwnProperty(prop)) {
      reciever[prop] = provider[prop];
    }
  }
}

class BaseModel {
  constructor(document, preClean) {
    document = document || {};

    if (preClean) {
      document = this._getSchema().clean(document);
    }

    extend(this, document);
    this._document = document;
  }

  static createEmpty(_id) {
    return new this({
      _id: _id
    });
  }

  static methods(methodMap) {
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

  static updateTransformFunction() {
    this.prototype.getCollection()._transform = document => {
      return new this(document);
    };
  }

  static attachCollection(collection, transform = true) {
    this.prototype.getCollection = function () {
      return collection;
    };

    Meteor[collection._name] = collection;

    if (transform) {
      this.updateTransformFunction();
    }
  }

  static appendSchema(schemaObject) {
    var schema = new SimpleSchema(schemaObject);
    var collection = this.prototype.getCollection();

    if (collection) {
      collection.attachSchema(schema);
    } else {
      throw new Error("Can't append schema to non existent collection. Please use extendAndSetupCollection() to create your models");
    }
  }

  _getSchema() {
    var schema = Meteor._get(this.getCollection(), "_c2", "_simpleSchema");

    if (schema) {
      return schema;
    } else {
      throw new Meteor.Error("noSchema", "You don't have a schema defined for " + this.getCollectionName());
    }
  }

  getCollection() {
    //We just throw here. This method is reassigned in attachCollection method when collection is attached.
    throw new Meteor.Error("noCollection", "You must use ClassName.attachCollection to attach a collection to your model.");
  }

  getCollectionName() {
    return this.getCollection()._name;
  } // get all values from the model that do not have a denyUpdate or denyUntrusted in their schema


  getUpdatableFields() {
    const schema = this._getSchema()._schema;

    const fields = {
      _id: this._id
    };

    for (let key of Object.keys(this)) {
      if (schema[key] && !(schema[key].custom && schema[key].custom === SimpleSchema.denyUntrusted) && !schema[key].denyUdate) {
        fields[key] = this[key];
      }
    }

    return fields;
  }

  checkOwnership() {
    return this.userId === Meteor.userId();
  }

  save(callback) {
    const schema = this._getSchema();

    let obj = Object.keys(this).filter(key => key !== "_document").reduce((accumulator, key) => {
      accumulator[key] = this[key];
      return accumulator;
    }, {});

    if (this._id) {
      let updateDiff = diff(this._document, obj);

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

  update(modifier, callback) {
    if (this._id) {
      this.getCollection().update(this._id, modifier, callback);
    }
  }

  _setProps(key, value, validationPathOnly) {
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

  _updateLocal(modifier) {
    this.getCollection()._collection.update(this._id, modifier);
  }

  set(key, value) {
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

  remove(callback) {
    if (this._id) {
      this.getCollection().remove({
        _id: this._id
      }, callback);
    }
  }

}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"security.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/socialize_base-model/security.js                                                                 //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
let SimpleSchema;
module.watch(require("meteor/aldeed:simple-schema"), {
  SimpleSchema(v) {
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
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"node_modules":{"rus-diff":{"package.json":function(require,exports){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// node_modules/meteor/socialize_base-model/node_modules/rus-diff/package.json                               //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
exports.name = "rus-diff";
exports.version = "1.1.0";
exports.main = "lib/index.js";

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"index.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// node_modules/meteor/socialize_base-model/node_modules/rus-diff/lib/index.js                               //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
module.useNode();
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

//# sourceURL=meteor://💻app/packages/socialize_base-model.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc29jaWFsaXplOmJhc2UtbW9kZWwvYmFzZS1tb2RlbC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc29jaWFsaXplOmJhc2UtbW9kZWwvc2VjdXJpdHkuanMiXSwibmFtZXMiOlsibW9kdWxlIiwiZXhwb3J0IiwiQmFzZU1vZGVsIiwiXyIsIndhdGNoIiwicmVxdWlyZSIsInYiLCJNZXRlb3IiLCJTaW1wbGVTY2hlbWEiLCJkaWZmIiwiZXh0ZW5kIiwicmVjaWV2ZXIiLCJwcm92aWRlciIsInByb3AiLCJoYXNPd25Qcm9wZXJ0eSIsImNvbnN0cnVjdG9yIiwiZG9jdW1lbnQiLCJwcmVDbGVhbiIsIl9nZXRTY2hlbWEiLCJjbGVhbiIsIl9kb2N1bWVudCIsImNyZWF0ZUVtcHR5IiwiX2lkIiwibWV0aG9kcyIsIm1ldGhvZE1hcCIsInNlbGYiLCJpc09iamVjdCIsImVhY2giLCJtZXRob2QiLCJuYW1lIiwiaXNGdW5jdGlvbiIsInByb3RvdHlwZSIsIkVycm9yIiwidXBkYXRlVHJhbnNmb3JtRnVuY3Rpb24iLCJnZXRDb2xsZWN0aW9uIiwiX3RyYW5zZm9ybSIsImF0dGFjaENvbGxlY3Rpb24iLCJjb2xsZWN0aW9uIiwidHJhbnNmb3JtIiwiX25hbWUiLCJhcHBlbmRTY2hlbWEiLCJzY2hlbWFPYmplY3QiLCJzY2hlbWEiLCJhdHRhY2hTY2hlbWEiLCJfZ2V0IiwiZ2V0Q29sbGVjdGlvbk5hbWUiLCJnZXRVcGRhdGFibGVGaWVsZHMiLCJfc2NoZW1hIiwiZmllbGRzIiwia2V5IiwiT2JqZWN0Iiwia2V5cyIsImN1c3RvbSIsImRlbnlVbnRydXN0ZWQiLCJkZW55VWRhdGUiLCJjaGVja093bmVyc2hpcCIsInVzZXJJZCIsInNhdmUiLCJjYWxsYmFjayIsIm9iaiIsImZpbHRlciIsInJlZHVjZSIsImFjY3VtdWxhdG9yIiwidXBkYXRlRGlmZiIsImlzRW1wdHkiLCJ1cGRhdGUiLCJpc0NsaWVudCIsImluc2VydCIsIm1vZGlmaWVyIiwiX3NldFByb3BzIiwidmFsdWUiLCJ2YWxpZGF0aW9uUGF0aE9ubHkiLCJjdXJyZW50IiwibGV2ZWwiLCJzdGVwcyIsInNwbGl0IiwibGFzdCIsInBvcCIsInNldCIsImN1cnJlbnRTZXQiLCJzaGlmdCIsIl91cGRhdGVMb2NhbCIsIl9jb2xsZWN0aW9uIiwiY29udGV4dCIsIm5ld0NvbnRleHQiLCIkc2V0IiwidmFsaWRhdGUiLCJrZXlFcnJvck1lc3NhZ2UiLCJyZW1vdmUiLCJtZXNzYWdlcyIsIlVudHJ1c3RlZCIsImlzU2V0IiwiYXV0b1ZhbHVlIiwiZGVmaW5pdGlvbiIsImNhbGwiLCJkZWZhdWx0VmFsdWUiLCJpc0Zyb21UcnVzdGVkQ29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUFBLE9BQU9DLE1BQVAsQ0FBYztBQUFDQyxhQUFVLE1BQUlBO0FBQWYsQ0FBZDs7QUFBeUMsSUFBSUMsQ0FBSjs7QUFBTUgsT0FBT0ksS0FBUCxDQUFhQyxRQUFRLG1CQUFSLENBQWIsRUFBMEM7QUFBQ0YsSUFBRUcsQ0FBRixFQUFJO0FBQUNILFFBQUVHLENBQUY7QUFBSTs7QUFBVixDQUExQyxFQUFzRCxDQUF0RDtBQUF5RCxJQUFJQyxNQUFKO0FBQVdQLE9BQU9JLEtBQVAsQ0FBYUMsUUFBUSxlQUFSLENBQWIsRUFBc0M7QUFBQ0UsU0FBT0QsQ0FBUCxFQUFTO0FBQUNDLGFBQU9ELENBQVA7QUFBUzs7QUFBcEIsQ0FBdEMsRUFBNEQsQ0FBNUQ7QUFBK0QsSUFBSUUsWUFBSjtBQUFpQlIsT0FBT0ksS0FBUCxDQUFhQyxRQUFRLDZCQUFSLENBQWIsRUFBb0Q7QUFBQ0csZUFBYUYsQ0FBYixFQUFlO0FBQUNFLG1CQUFhRixDQUFiO0FBQWU7O0FBQWhDLENBQXBELEVBQXNGLENBQXRGO0FBQXlGLElBQUlHLElBQUo7QUFBU1QsT0FBT0ksS0FBUCxDQUFhQyxRQUFRLFVBQVIsQ0FBYixFQUFpQztBQUFDSSxPQUFLSCxDQUFMLEVBQU87QUFB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b2NpYWxpemVfYmFzZS1tb2RlbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IF8gfSBmcm9tICdtZXRlb3IvdW5kZXJzY29yZSc7XG5pbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IFNpbXBsZVNjaGVtYSB9IGZyb20gJ21ldGVvci9hbGRlZWQ6c2ltcGxlLXNjaGVtYSc7XG5pbXBvcnQgeyBkaWZmIH0gZnJvbSAncnVzLWRpZmYnO1xuaW1wb3J0ICcuL3NlY3VyaXR5LmpzJztcblxuZnVuY3Rpb24gZXh0ZW5kKHJlY2lldmVyLCBwcm92aWRlcikge1xuICAgIGZvcih2YXIgcHJvcCBpbiBwcm92aWRlcil7XG4gICAgICAgIGlmKHByb3ZpZGVyLmhhc093blByb3BlcnR5KHByb3ApKXtcbiAgICAgICAgICAgIHJlY2lldmVyW3Byb3BdID0gcHJvdmlkZXJbcHJvcF07XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBCYXNlTW9kZWwge1xuICAgIGNvbnN0cnVjdG9yKGRvY3VtZW50LCBwcmVDbGVhbil7XG4gICAgICAgIGRvY3VtZW50ID0gZG9jdW1lbnQgfHwge307XG4gICAgICAgIGlmKHByZUNsZWFuKXtcbiAgICAgICAgICAgIGRvY3VtZW50ID0gdGhpcy5fZ2V0U2NoZW1hKCkuY2xlYW4oZG9jdW1lbnQpO1xuICAgICAgICB9XG4gICAgICAgIGV4dGVuZCh0aGlzLCBkb2N1bWVudCk7XG4gICAgICAgIHRoaXMuX2RvY3VtZW50ID0gZG9jdW1lbnQ7XG4gICAgfVxuXG4gICAgc3RhdGljIGNyZWF0ZUVtcHR5KF9pZCkge1xuICAgICAgICByZXR1cm4gbmV3IHRoaXMoe19pZDpfaWR9KTtcbiAgICB9XG5cbiAgICBzdGF0aWMgbWV0aG9kcyhtZXRob2RNYXApIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICBpZihfLmlzT2JqZWN0KG1ldGhvZE1hcCkpe1xuICAgICAgICAgICAgXy5lYWNoKG1ldGhvZE1hcCwgZnVuY3Rpb24obWV0aG9kLCBuYW1lKXtcbiAgICAgICAgICAgICAgICBpZihfLmlzRnVuY3Rpb24obWV0aG9kKSl7XG4gICAgICAgICAgICAgICAgICAgIGlmKCFzZWxmLnByb3RvdHlwZVtuYW1lXSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnByb3RvdHlwZVtuYW1lXSA9IG1ldGhvZDtcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiZXhpc3RlbnQtbWV0aG9kXCIsIFwiVGhlIG1ldGhvZCBcIituYW1lK1wiIGFscmVhZHkgZXhpc3RzLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHN0YXRpYyB1cGRhdGVUcmFuc2Zvcm1GdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5wcm90b3R5cGUuZ2V0Q29sbGVjdGlvbigpLl90cmFuc2Zvcm0gPSAoZG9jdW1lbnQpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgdGhpcyhkb2N1bWVudCk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgc3RhdGljIGF0dGFjaENvbGxlY3Rpb24oY29sbGVjdGlvbiwgdHJhbnNmb3JtID0gdHJ1ZSkge1xuICAgICAgICB0aGlzLnByb3RvdHlwZS5nZXRDb2xsZWN0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgICAgICAgfTtcblxuICAgICAgICBNZXRlb3JbY29sbGVjdGlvbi5fbmFtZV0gPSBjb2xsZWN0aW9uO1xuXG4gICAgICAgIGlmKHRyYW5zZm9ybSl7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVRyYW5zZm9ybUZ1bmN0aW9uKCk7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHN0YXRpYyBhcHBlbmRTY2hlbWEoc2NoZW1hT2JqZWN0KSB7XG4gICAgICAgIHZhciBzY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHNjaGVtYU9iamVjdCk7XG4gICAgICAgIHZhciBjb2xsZWN0aW9uID0gdGhpcy5wcm90b3R5cGUuZ2V0Q29sbGVjdGlvbigpO1xuXG4gICAgICAgIGlmKGNvbGxlY3Rpb24pe1xuICAgICAgICAgICAgY29sbGVjdGlvbi5hdHRhY2hTY2hlbWEoc2NoZW1hKTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCBhcHBlbmQgc2NoZW1hIHRvIG5vbiBleGlzdGVudCBjb2xsZWN0aW9uLiBQbGVhc2UgdXNlIGV4dGVuZEFuZFNldHVwQ29sbGVjdGlvbigpIHRvIGNyZWF0ZSB5b3VyIG1vZGVsc1wiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9nZXRTY2hlbWEoKSB7XG4gICAgICAgIHZhciBzY2hlbWEgPSBNZXRlb3IuX2dldCh0aGlzLmdldENvbGxlY3Rpb24oKSwgXCJfYzJcIiwgXCJfc2ltcGxlU2NoZW1hXCIpO1xuICAgICAgICBpZihzY2hlbWEpe1xuICAgICAgICAgICAgcmV0dXJuIHNjaGVtYTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwibm9TY2hlbWFcIiwgXCJZb3UgZG9uJ3QgaGF2ZSBhIHNjaGVtYSBkZWZpbmVkIGZvciBcIiArIHRoaXMuZ2V0Q29sbGVjdGlvbk5hbWUoKSk7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGdldENvbGxlY3Rpb24oKSB7XG4gICAgICAgIC8vV2UganVzdCB0aHJvdyBoZXJlLiBUaGlzIG1ldGhvZCBpcyByZWFzc2lnbmVkIGluIGF0dGFjaENvbGxlY3Rpb24gbWV0aG9kIHdoZW4gY29sbGVjdGlvbiBpcyBhdHRhY2hlZC5cbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIm5vQ29sbGVjdGlvblwiLCBcIllvdSBtdXN0IHVzZSBDbGFzc05hbWUuYXR0YWNoQ29sbGVjdGlvbiB0byBhdHRhY2ggYSBjb2xsZWN0aW9uIHRvIHlvdXIgbW9kZWwuXCIpO1xuICAgIH1cblxuXG4gICAgZ2V0Q29sbGVjdGlvbk5hbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldENvbGxlY3Rpb24oKS5fbmFtZTtcbiAgICB9XG5cbiAgICAvLyBnZXQgYWxsIHZhbHVlcyBmcm9tIHRoZSBtb2RlbCB0aGF0IGRvIG5vdCBoYXZlIGEgZGVueVVwZGF0ZSBvciBkZW55VW50cnVzdGVkIGluIHRoZWlyIHNjaGVtYVxuICAgIGdldFVwZGF0YWJsZUZpZWxkcygpIHtcbiAgICAgICAgY29uc3Qgc2NoZW1hID0gdGhpcy5fZ2V0U2NoZW1hKCkuX3NjaGVtYTtcbiAgICAgICAgY29uc3QgZmllbGRzID0ge19pZDogdGhpcy5faWR9O1xuXG4gICAgICAgIGZvcihsZXQga2V5IG9mIE9iamVjdC5rZXlzKHRoaXMpKXtcbiAgICAgICAgICAgIGlmIChzY2hlbWFba2V5XSAmJiAhKHNjaGVtYVtrZXldLmN1c3RvbSAmJiBzY2hlbWFba2V5XS5jdXN0b20gPT09IFNpbXBsZVNjaGVtYS5kZW55VW50cnVzdGVkKSAmJiAhc2NoZW1hW2tleV0uZGVueVVkYXRlKXtcbiAgICAgICAgICAgICAgICBmaWVsZHNba2V5XSA9IHRoaXNba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmaWVsZHM7XG4gICAgfVxuXG4gICAgY2hlY2tPd25lcnNoaXAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnVzZXJJZCA9PT0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIH1cblxuICAgIHNhdmUoY2FsbGJhY2spIHtcbiAgICAgICAgY29uc3Qgc2NoZW1hID0gdGhpcy5fZ2V0U2NoZW1hKCk7XG5cbiAgICAgICAgbGV0IG9iaiA9IE9iamVjdC5rZXlzKHRoaXMpLmZpbHRlcihcbiAgICAgICAgICAgIChrZXkpID0+IGtleSAhPT0gXCJfZG9jdW1lbnRcIikucmVkdWNlKFxuICAgICAgICAgICAgICAgIChhY2N1bXVsYXRvciwga2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgICBhY2N1bXVsYXRvcltrZXldID0gdGhpc1trZXldO1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGFjY3VtdWxhdG9yO1xuICAgICAgICAgICAgICAgIH0sIHt9XG4gICAgICAgICAgICApO1xuXG4gICAgICAgIGlmKHRoaXMuX2lkKXtcbiAgICAgICAgICAgIGxldCB1cGRhdGVEaWZmID0gZGlmZih0aGlzLl9kb2N1bWVudCwgb2JqKTtcbiAgICAgICAgICAgIGlmKCFfLmlzRW1wdHkodXBkYXRlRGlmZikpe1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKHVwZGF0ZURpZmYsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2sobnVsbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgaWYoTWV0ZW9yLmlzQ2xpZW50ICYmIHNjaGVtYSl7XG4gICAgICAgICAgICAgICAgb2JqID0gc2NoZW1hLmNsZWFuKG9iaik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9pZCA9IHRoaXMuZ2V0Q29sbGVjdGlvbigpLmluc2VydChvYmosIGNhbGxiYWNrKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHVwZGF0ZShtb2RpZmllciwgY2FsbGJhY2spIHtcbiAgICAgICAgaWYodGhpcy5faWQpe1xuICAgICAgICAgICAgdGhpcy5nZXRDb2xsZWN0aW9uKCkudXBkYXRlKHRoaXMuX2lkLCBtb2RpZmllciwgY2FsbGJhY2spO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgX3NldFByb3BzKGtleSwgdmFsdWUsIHZhbGlkYXRpb25QYXRoT25seSkge1xuICAgICAgICB2YXIgY3VycmVudDtcbiAgICAgICAgdmFyIGxldmVsID0gdGhpcztcbiAgICAgICAgdmFyIHN0ZXBzID0ga2V5LnNwbGl0KFwiLlwiKTtcbiAgICAgICAgdmFyIGxhc3QgPSBzdGVwcy5wb3AoKTtcbiAgICAgICAgdmFyIHNldCA9IHt9O1xuICAgICAgICB2YXIgY3VycmVudFNldCA9IHNldDtcblxuICAgICAgICB3aGlsZShjdXJyZW50ID0gc3RlcHMuc2hpZnQoKSl7XG4gICAgICAgICAgICBpZighdmFsaWRhdGlvblBhdGhPbmx5KXtcbiAgICAgICAgICAgICAgICBpZihsZXZlbFtjdXJyZW50XSl7XG4gICAgICAgICAgICAgICAgICAgIGlmKCFfLmlzT2JqZWN0KGxldmVsW2N1cnJlbnRdKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiUHJvcGVydHlOb3RPYmplY3RcIiwgY3VycmVudCArIFwiIG9mIFwiICsga2V5ICsgXCIgaXMgbm90IGFuIG9iamVjdFwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICBsZXZlbFtjdXJyZW50XSA9IHt9O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxldmVsID0gbGV2ZWxbY3VycmVudF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjdXJyZW50U2V0ID0gY3VycmVudFNldFtjdXJyZW50XSA9IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoIXZhbGlkYXRpb25QYXRoT25seSkgeyBsZXZlbFtsYXN0XSA9IHZhbHVlOyB9XG5cbiAgICAgICAgY3VycmVudFNldFtsYXN0XSA9IHZhbHVlO1xuXG4gICAgICAgIHJldHVybiBzZXQ7XG4gICAgfVxuXG5cbiAgICBfdXBkYXRlTG9jYWwobW9kaWZpZXIpIHtcbiAgICAgICAgdGhpcy5nZXRDb2xsZWN0aW9uKCkuX2NvbGxlY3Rpb24udXBkYXRlKHRoaXMuX2lkLCBtb2RpZmllcik7XG4gICAgfVxuXG4gICAgc2V0KGtleSwgdmFsdWUpIHtcbiAgICAgICAgdmFyIGNvbnRleHQgPSB0aGlzLl9nZXRTY2hlbWEoKS5uZXdDb250ZXh0KCk7XG4gICAgICAgIHZhciBvYmogPSB7fTtcblxuICAgICAgICBvYmouJHNldCA9IHRoaXMuX3NldFByb3BzKGtleSwgdmFsdWUsIHRydWUpO1xuXG4gICAgICAgIGlmKGNvbnRleHQudmFsaWRhdGUob2JqLCB7bW9kaWZpZXI6dHJ1ZX0pKXtcbiAgICAgICAgICAgIG9iai4kc2V0ID0gdGhpcy5fc2V0UHJvcHMoa2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICB0aGlzW2tleV0gPSB2YWx1ZTtcblxuICAgICAgICAgICAgaWYoTWV0ZW9yLmlzQ2xpZW50KXtcbiAgICAgICAgICAgICAgICB0aGlzLl9pZCAmJiB0aGlzLl91cGRhdGVMb2NhbChvYmopO1xuICAgICAgICAgICAgfVxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoY29udGV4dC5rZXlFcnJvck1lc3NhZ2Uoa2V5KSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcmVtb3ZlKGNhbGxiYWNrKSB7XG4gICAgICAgIGlmKHRoaXMuX2lkKXtcbiAgICAgICAgICAgIHRoaXMuZ2V0Q29sbGVjdGlvbigpLnJlbW92ZSh7X2lkOnRoaXMuX2lkfSwgY2FsbGJhY2spO1xuICAgICAgICB9XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBTaW1wbGVTY2hlbWEgfSBmcm9tICdtZXRlb3IvYWxkZWVkOnNpbXBsZS1zY2hlbWEnO1xuXG5TaW1wbGVTY2hlbWEubWVzc2FnZXMoe1VudHJ1c3RlZDogXCJJbnNlcnRzL1VwZGF0ZXMgZnJvbSB1bnRydXN0ZWQgY29kZSBub3Qgc3VwcG9ydGVkXCJ9KTtcblxuU2ltcGxlU2NoZW1hLmRlbnlVbnRydXN0ZWQgPSBmdW5jdGlvbigpIHtcbiAgICBpZih0aGlzLmlzU2V0KXtcbiAgICAgICAgdmFyIGF1dG9WYWx1ZSA9IHRoaXMuZGVmaW5pdGlvbi5hdXRvVmFsdWUgJiYgdGhpcy5kZWZpbml0aW9uLmF1dG9WYWx1ZS5jYWxsKHRoaXMpO1xuICAgICAgICB2YXIgZGVmYXVsdFZhbHVlID0gdGhpcy5kZWZpbml0aW9uLmRlZmF1bHRWYWx1ZTtcblxuICAgICAgICBpZih0aGlzLnZhbHVlICE9IGRlZmF1bHRWYWx1ZSAmJiB0aGlzLnZhbHVlICE9IGF1dG9WYWx1ZSAmJiAhdGhpcy5pc0Zyb21UcnVzdGVkQ29kZSl7XG4gICAgICAgICAgICByZXR1cm4gXCJVbnRydXN0ZWRcIjtcbiAgICAgICAgfVxuICAgIH1cbn07XG4iXX0=
