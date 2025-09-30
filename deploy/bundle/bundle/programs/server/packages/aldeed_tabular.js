(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var check = Package.check.check;
var Match = Package.check.Match;
var ECMAScript = Package.ecmascript.ECMAScript;
var _ = Package.underscore._;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var Tabular;

var require = meteorInstall({"node_modules":{"meteor":{"aldeed:tabular":{"server":{"main.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/aldeed_tabular/server/main.js                                                                          //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
let Meteor;
module.watch(require("meteor/meteor"), {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let check, Match;
module.watch(require("meteor/check"), {
  check(v) {
    check = v;
  },

  Match(v) {
    Match = v;
  }

}, 1);

let _;

module.watch(require("meteor/underscore"), {
  _(v) {
    _ = v;
  }

}, 2);
let Tabular;
module.watch(require("../common/Tabular"), {
  default(v) {
    Tabular = v;
  }

}, 3);

/*
 * These are the two publications used by TabularTable.
 *
 * The genericPub one can be overridden by supplying a `pub`
 * property with a different publication name. This publication
 * is given only the list of ids and requested fields. You may
 * want to override it if you need to publish documents from
 * related collections along with the table collection documents.
 *
 * The getInfo one runs first and handles all the complex logic
 * required by this package, so that you don't have to duplicate
 * this logic when overriding the genericPub function.
 *
 * Having two publications also allows fine-grained control of
 * reactivity on the client.
 */
Meteor.publish('tabular_genericPub', function (tableName, ids, fields) {
  check(tableName, String);
  check(ids, Array);
  check(fields, Match.Optional(Object));
  const table = Tabular.tablesByName[tableName];

  if (!table) {
    // We throw an error in the other pub, so no need to throw one here
    this.ready();
    return;
  } // Check security. We call this in both publications.


  if (typeof table.allow === 'function' && !table.allow(this.userId, fields)) {
    this.ready();
    return;
  } // Check security for fields. We call this only in this publication


  if (typeof table.allowFields === 'function' && !table.allowFields(this.userId, fields)) {
    this.ready();
    return;
  }

  return table.collection.find({
    _id: {
      $in: ids
    }
  }, {
    fields: fields
  });
});
Meteor.publish('tabular_getInfo', function (tableName, selector, sort, skip, limit) {
  check(tableName, String);
  check(selector, Match.Optional(Match.OneOf(Object, null)));
  check(sort, Match.Optional(Match.OneOf(Array, null)));
  check(skip, Number);
  check(limit, Match.Optional(Match.OneOf(Number, null)));
  const table = Tabular.tablesByName[tableName];

  if (!table) {
    throw new Error(`No TabularTable defined with the name "${tableName}". Make sure you are defining your TabularTable in common code.`);
  } // Check security. We call this in both publications.
  // Even though we're only publishing _ids and counts
  // from this function, with sensitive data, there is
  // a chance someone could do a query and learn something
  // just based on whether a result is found or not.


  if (typeof table.allow === 'function' && !table.allow(this.userId)) {
    this.ready();
    return;
  }

  selector = selector || {}; // Allow the user to modify the selector before we use it

  if (typeof table.changeSelector === 'function') {
    selector = table.changeSelector(selector, this.userId);
  } // Apply the server side selector specified in the tabular
  // table constructor. Both must be met, so we join
  // them using $and, allowing both selectors to have
  // the same keys.


  if (typeof table.selector === 'function') {
    const tableSelector = table.selector(this.userId);

    if (_.isEmpty(selector)) {
      selector = tableSelector;
    } else {
      selector = {
        $and: [tableSelector, selector]
      };
    }
  }

  const findOptions = {
    skip: skip,
    fields: {
      _id: 1
    }
  }; // `limit` may be `null`

  if (limit > 0) {
    findOptions.limit = limit;
  } // `sort` may be `null`


  if (_.isArray(sort)) {
    findOptions.sort = sort;
  }

  const filteredCursor = table.collection.find(selector, findOptions);
  let filteredRecordIds = filteredCursor.map(doc => doc._id); // If we are not going to count for real, in order to improve performance, then we will fake
  // the count to ensure the Next button is always available.

  const fakeCount = filteredRecordIds.length + skip + 1;
  const countCursor = table.collection.find(selector, {
    fields: {
      _id: 1
    }
  });
  let recordReady = false;

  let updateRecords = () => {
    let currentCount;

    if (!table.skipCount) {
      if (typeof table.alternativeCount === 'function') {
        currentCount = table.alternativeCount(selector);
      } else {
        currentCount = countCursor.count();
      }
    } // From https://datatables.net/manual/server-side
    // recordsTotal: Total records, before filtering (i.e. the total number of records in the database)
    // recordsFiltered: Total records, after filtering (i.e. the total number of records after filtering has been applied - not just the number of records being returned for this page of data).


    const record = {
      ids: filteredRecordIds,
      // count() will give us the updated total count
      // every time. It does not take the find options
      // limit into account.
      recordsTotal: table.skipCount ? fakeCount : currentCount,
      recordsFiltered: table.skipCount ? fakeCount : currentCount
    };

    if (recordReady) {
      //console.log('changed', tableName, record);
      this.changed('tabular_records', tableName, record);
    } else {
      //console.log('added', tableName, record);
      this.added('tabular_records', tableName, record);
      recordReady = true;
    }
  };

  if (table.throttleRefresh) {
    // Why Meteor.bindEnvironment? See https://github.com/aldeed/meteor-tabular/issues/278#issuecomment-217318112
    updateRecords = _.throttle(Meteor.bindEnvironment(updateRecords), table.throttleRefresh);
  }

  updateRecords();
  this.ready(); // Handle docs being added or removed from the result set.

  let initializing = true;
  const handle = filteredCursor.observeChanges({
    added: function (id) {
      if (initializing) return; //console.log('ADDED');

      filteredRecordIds.push(id);
      updateRecords();
    },
    removed: function (id) {
      //console.log('REMOVED');
      // _.findWhere is used to support Mongo ObjectIDs
      filteredRecordIds = _.without(filteredRecordIds, _.findWhere(filteredRecordIds, id));
      updateRecords();
    }
  });
  initializing = false; // It is too inefficient to use an observe without any limits to track count perfectly
  // accurately when, for example, the selector is {} and there are a million documents.
  // Instead we will update the count every 10 seconds, in addition to whenever the limited
  // result set changes.

  const interval = Meteor.setInterval(updateRecords, 10000); // Stop observing the cursors when client unsubs.
  // Stopping a subscription automatically takes
  // care of sending the client any removed messages.

  this.onStop(() => {
    Meteor.clearInterval(interval);
    handle.stop();
  });
});
module.exportDefault(Tabular);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"common":{"Tabular.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/aldeed_tabular/common/Tabular.js                                                                       //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
let Meteor;
module.watch(require("meteor/meteor"), {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let Mongo;
module.watch(require("meteor/mongo"), {
  Mongo(v) {
    Mongo = v;
  }

}, 1);
const Tabular = {};
Tabular.tablesByName = {};
Tabular.Table = class {
  constructor(options) {
    if (!options) throw new Error('Tabular.Table options argument is required');
    if (!options.name) throw new Error('Tabular.Table options must specify name');
    if (!options.columns) throw new Error('Tabular.Table options must specify columns');

    if (!(options.collection instanceof Mongo.Collection || options.collection instanceof Mongo.constructor // Fix: error if `collection: Meteor.users`
    )) {
      throw new Error('Tabular.Table options must specify collection');
    }

    this.name = options.name;
    this.collection = options.collection;
    this.pub = options.pub || 'tabular_genericPub'; // By default we use core `Meteor.subscribe`, but you can pass
    // a subscription manager like `sub: new SubsManager({cacheLimit: 20, expireIn: 3})`

    this.sub = options.sub || Meteor;
    this.onUnload = options.onUnload;
    this.allow = options.allow;
    this.allowFields = options.allowFields;
    this.changeSelector = options.changeSelector;
    this.throttleRefresh = options.throttleRefresh;
    this.alternativeCount = options.alternativeCount;
    this.skipCount = options.skipCount;

    if (_.isArray(options.extraFields)) {
      const fields = {};

      _.each(options.extraFields, fieldName => {
        fields[fieldName] = 1;
      });

      this.extraFields = fields;
    }

    this.selector = options.selector;
    this.options = _.omit(options, 'collection', 'pub', 'sub', 'onUnload', 'allow', 'allowFields', 'changeSelector', 'throttleRefresh', 'extraFields', 'alternativeCount', 'skipCount', 'name', 'selector');
    Tabular.tablesByName[this.name] = this;
  }

};
module.exportDefault(Tabular);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
var exports = require("/node_modules/meteor/aldeed:tabular/server/main.js");

/* Exports */
Package._define("aldeed:tabular", exports, {
  Tabular: Tabular
});

})();

//# sourceURL=meteor://💻app/packages/aldeed_tabular.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvYWxkZWVkOnRhYnVsYXIvc2VydmVyL21haW4uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2FsZGVlZDp0YWJ1bGFyL2NvbW1vbi9UYWJ1bGFyLmpzIl0sIm5hbWVzIjpbIk1ldGVvciIsIm1vZHVsZSIsIndhdGNoIiwicmVxdWlyZSIsInYiLCJjaGVjayIsIk1hdGNoIiwiXyIsIlRhYnVsYXIiLCJkZWZhdWx0IiwicHVibGlzaCIsInRhYmxlTmFtZSIsImlkcyIsImZpZWxkcyIsIlN0cmluZyIsIkFycmF5IiwiT3B0aW9uYWwiLCJPYmplY3QiLCJ0YWJsZSIsInRhYmxlc0J5TmFtZSIsInJlYWR5IiwiYWxsb3ciLCJ1c2VySWQiLCJhbGxvd0ZpZWxkcyIsImNvbGxlY3Rpb24iLCJmaW5kIiwiX2lkIiwiJGluIiwic2VsZWN0b3IiLCJzb3J0Iiwic2tpcCIsImxpbWl0IiwiT25lT2YiLCJOdW1iZXIiLCJFcnJvciIsImNoYW5nZVNlbGVjdG9yIiwidGFibGVTZWxlY3RvciIsImlzRW1wdHkiLCIkYW5kIiwiZmluZE9wdGlvbnMiLCJpc0FycmF5IiwiZmlsdGVyZWRDdXJzb3IiLCJmaWx0ZXJlZFJlY29yZElkcyIsIm1hcCIsImRvYyIsImZha2VDb3VudCIsImxlbmd0aCIsImNvdW50Q3Vyc29yIiwicmVjb3JkUmVhZHkiLCJ1cGRhdGVSZWNvcmRzIiwiY3VycmVudENvdW50Iiwic2tpcENvdW50IiwiYWx0ZXJuYXRpdmVDb3VudCIsImNvdW50IiwicmVjb3JkIiwicmVjb3Jkc1RvdGFsIiwicmVjb3Jkc0ZpbHRlcmVkIiwiY2hhbmdlZCIsImFkZGVkIiwidGhyb3R0bGVSZWZyZXNoIiwidGhyb3R0bGUiLCJiaW5kRW52aXJvbm1lbnQiLCJpbml0aWFsaXppbmciLCJoYW5kbGUiLCJvYnNlcnZlQ2hhbmdlcyIsImlkIiwicHVzaCIsInJlbW92ZWQiLCJ3aXRob3V0IiwiZmluZFdoZXJlIiwiaW50ZXJ2YWwiLCJzZXRJbnRlcnZhbCIsIm9uU3RvcCIsImNsZWFySW50ZXJ2YWwiLCJzdG9wIiwiZXhwb3J0RGVmYXVsdCIsIk1vbmdvIiwiVGFibGUiLCJjb25zdHJ1Y3RvciIsIm9wdGlvbnMiLCJuYW1lIiwiY29sdW1ucyIsIkNvbGxlY3Rpb24iLCJwdWIiLCJzdWIiLCJvblVubG9hZCIsImV4dHJhRmllbGRzIiwiZWFjaCIsImZpZWxkTmFtZSIsIm9taXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxNQUFKO0FBQVdDLE9BQU9DLEtBQVAsQ0FBYUMsUUFBUSxlQUFSLENBQWIsRUFBc0M7QUFBQ0gsU0FBT0ksQ0FBUCxFQUFTO0FBQUNKLGFBQU9JLENBQVA7QUFBUzs7QUFBcEIsQ0FBdEMsRUFBNEQsQ0FBNUQ7QUFBK0QsSUFBSUMsS0FBSixFQUFVQyxLQUFWO0FBQWdCTCxPQUFPQyxLQUFQLENBQWFDLFFBQVEsY0FBUixDQUFiLEVBQXFDO0FBQUNFLFFBQU1ELENBQU4sRUFBUTtBQUFDQyxZQUFNRCxDQUFOO0FBQVEsR0FBbEI7O0FBQW1CRSxRQUFNRixDQUFOLEVBQVE7QUFBQ0UsWUFBTUYsQ0FBTjtBQUFROztBQUFwQyxDQUFyQyxFQUEyRSxDQUEzRTs7QUFBOEUsSUFBSUcsQ0FBSjs7QUFBTU4sT0FBT0MsS0FBUCxDQUFhQyxRQUFRLG1CQUFSLENBQWIsRUFBMEM7QUFBQ0ksSUFBRUgsQ0FBRixFQUFJO0FBQUNHLFFBQUVILENBQUY7QUFBSTs7QUFBVixDQUExQyxFQUFzRCxDQUF0RDtBQUF5RCxJQUFJSSxPQUFKO0FBQVlQLE9BQU9DLEtBQVAsQ0FBYUMsUUFBUSxtQkFBUixDQUFiLEVBQTBDO0FBQUNNLFVBQVFMLENBQVIsRUFBVTtBQUFDSSxjQUFRSixDQUFSO0FBQVU7O0FBQXRCLENBQTFDLEVBQWtFLENBQWxFOztBQUtuUDs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQUosT0FBT1UsT0FBUCxDQUFlLG9CQUFmLEVBQXFDLFVBQVVDLFNBQVYsRUFBcUJDLEdBQXJCLEVBQTBCQyxNQUExQixFQUFrQztBQUNyRVIsUUFBTU0sU0FBTixFQUFpQkcsTUFBakI7QUFDQVQsUUFBTU8sR0FBTixFQUFXRyxLQUFYO0FBQ0FWLFFBQU1RLE1BQU4sRUFBY1AsTUFBTVUsUUFBTixDQUFlQyxNQUFmLENBQWQ7QUFFQSxRQUFNQyxRQUFRVixRQUFRVyxZQUFSLENBQXFCUixTQUFyQixDQUFkOztBQUNBLE1BQUksQ0FBQ08sS0FBTCxFQUFZO0FBQ1Y7QUFDQSxTQUFLRSxLQUFMO0FBQ0E7QUFDRCxHQVZvRSxDQVlyRTs7O0FBQ0EsTUFBSSxPQUFPRixNQUFNRyxLQUFiLEtBQXVCLFVBQXZCLElBQXFDLENBQUNILE1BQU1HLEtBQU4sQ0FBWSxLQUFLQyxNQUFqQixFQUF5QlQsTUFBekIsQ0FBMUMsRUFBNEU7QUFDMUUsU0FBS08sS0FBTDtBQUNBO0FBQ0QsR0FoQm9FLENBa0JyRTs7O0FBQ0EsTUFBSSxPQUFPRixNQUFNSyxXQUFiLEtBQTZCLFVBQTdCLElBQTJDLENBQUNMLE1BQU1LLFdBQU4sQ0FBa0IsS0FBS0QsTUFBdkIsRUFBK0JULE1BQS9CLENBQWhELEVBQXdGO0FBQ3RGLFNBQUtPLEtBQUw7QUFDQTtBQUNEOztBQUVELFNBQU9GLE1BQU1NLFVBQU4sQ0FBaUJDLElBQWpCLENBQXNCO0FBQUNDLFNBQUs7QUFBQ0MsV0FBS2Y7QUFBTjtBQUFOLEdBQXRCLEVBQXlDO0FBQUNDLFlBQVFBO0FBQVQsR0FBekMsQ0FBUDtBQUNELENBekJEO0FBMkJBYixPQUFPVSxPQUFQLENBQWUsaUJBQWYsRUFBa0MsVUFBVUMsU0FBVixFQUFxQmlCLFFBQXJCLEVBQStCQyxJQUEvQixFQUFxQ0MsSUFBckMsRUFBMkNDLEtBQTNDLEVBQWtEO0FBQ2xGMUIsUUFBTU0sU0FBTixFQUFpQkcsTUFBakI7QUFDQVQsUUFBTXVCLFFBQU4sRUFBZ0J0QixNQUFNVSxRQUFOLENBQWVWLE1BQU0wQixLQUFOLENBQVlmLE1BQVosRUFBb0IsSUFBcEIsQ0FBZixDQUFoQjtBQUNBWixRQUFNd0IsSUFBTixFQUFZdkIsTUFBTVUsUUFBTixDQUFlVixNQUFNMEIsS0FBTixDQUFZakIsS0FBWixFQUFtQixJQUFuQixDQUFmLENBQVo7QUFDQVYsUUFBTXlCLElBQU4sRUFBWUcsTUFBWjtBQUNBNUIsUUFBTTBCLEtBQU4sRUFBYXpCLE1BQU1VLFFBQU4sQ0FBZVYsTUFBTTBCLEtBQU4sQ0FBWUMsTUFBWixFQUFvQixJQUFwQixDQUFmLENBQWI7QUFFQSxRQUFNZixRQUFRVixRQUFRVyxZQUFSLENBQXFCUixTQUFyQixDQUFkOztBQUNBLE1BQUksQ0FBQ08sS0FBTCxFQUFZO0FBQ1YsVUFBTSxJQUFJZ0IsS0FBSixDQUFXLDBDQUF5Q3ZCLFNBQVUsaUVBQTlELENBQU47QUFDRCxHQVZpRixDQVlsRjtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxNQUFJLE9BQU9PLE1BQU1HLEtBQWIsS0FBdUIsVUFBdkIsSUFBcUMsQ0FBQ0gsTUFBTUcsS0FBTixDQUFZLEtBQUtDLE1BQWpCLENBQTFDLEVBQW9FO0FBQ2xFLFNBQUtGLEtBQUw7QUFDQTtBQUNEOztBQUVEUSxhQUFXQSxZQUFZLEVBQXZCLENBdEJrRixDQXdCbEY7O0FBQ0EsTUFBSSxPQUFPVixNQUFNaUIsY0FBYixLQUFnQyxVQUFwQyxFQUFnRDtBQUM5Q1AsZUFBV1YsTUFBTWlCLGNBQU4sQ0FBcUJQLFFBQXJCLEVBQStCLEtBQUtOLE1BQXBDLENBQVg7QUFDRCxHQTNCaUYsQ0E2QmxGO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQSxNQUFJLE9BQU9KLE1BQU1VLFFBQWIsS0FBMEIsVUFBOUIsRUFBMEM7QUFDeEMsVUFBTVEsZ0JBQWdCbEIsTUFBTVUsUUFBTixDQUFlLEtBQUtOLE1BQXBCLENBQXRCOztBQUNBLFFBQUlmLEVBQUU4QixPQUFGLENBQVVULFFBQVYsQ0FBSixFQUF5QjtBQUN2QkEsaUJBQVdRLGFBQVg7QUFDRCxLQUZELE1BRU87QUFDTFIsaUJBQVc7QUFBQ1UsY0FBTSxDQUFDRixhQUFELEVBQWdCUixRQUFoQjtBQUFQLE9BQVg7QUFDRDtBQUNGOztBQUVELFFBQU1XLGNBQWM7QUFDbEJULFVBQU1BLElBRFk7QUFFbEJqQixZQUFRO0FBQUNhLFdBQUs7QUFBTjtBQUZVLEdBQXBCLENBMUNrRixDQStDbEY7O0FBQ0EsTUFBSUssUUFBUSxDQUFaLEVBQWU7QUFDYlEsZ0JBQVlSLEtBQVosR0FBb0JBLEtBQXBCO0FBQ0QsR0FsRGlGLENBb0RsRjs7O0FBQ0EsTUFBSXhCLEVBQUVpQyxPQUFGLENBQVVYLElBQVYsQ0FBSixFQUFxQjtBQUNuQlUsZ0JBQVlWLElBQVosR0FBbUJBLElBQW5CO0FBQ0Q7O0FBRUQsUUFBTVksaUJBQWlCdkIsTUFBTU0sVUFBTixDQUFpQkMsSUFBakIsQ0FBc0JHLFFBQXRCLEVBQWdDVyxXQUFoQyxDQUF2QjtBQUVBLE1BQUlHLG9CQUFvQkQsZUFBZUUsR0FBZixDQUFtQkMsT0FBT0EsSUFBSWxCLEdBQTlCLENBQXhCLENBM0RrRixDQTZEbEY7QUFDQTs7QUFDQSxRQUFNbUIsWUFBWUgsa0JBQWtCSSxNQUFsQixHQUEyQmhCLElBQTNCLEdBQWtDLENBQXBEO0FBRUEsUUFBTWlCLGNBQWM3QixNQUFNTSxVQUFOLENBQWlCQyxJQUFqQixDQUFzQkcsUUFBdEIsRUFBZ0M7QUFBQ2YsWUFBUTtBQUFDYSxXQUFLO0FBQU47QUFBVCxHQUFoQyxDQUFwQjtBQUVBLE1BQUlzQixjQUFjLEtBQWxCOztBQUNBLE1BQUlDLGdCQUFnQixNQUFNO0FBQ3hCLFFBQUlDLFlBQUo7O0FBQ0EsUUFBSSxDQUFDaEMsTUFBTWlDLFNBQVgsRUFBc0I7QUFDcEIsVUFBSSxPQUFPakMsTUFBTWtDLGdCQUFiLEtBQWtDLFVBQXRDLEVBQWtEO0FBQ2hERix1QkFBZWhDLE1BQU1rQyxnQkFBTixDQUF1QnhCLFFBQXZCLENBQWY7QUFDRCxPQUZELE1BRU87QUFDTHNCLHVCQUFlSCxZQUFZTSxLQUFaLEVBQWY7QUFDRDtBQUNGLEtBUnVCLENBVXhCO0FBQ0E7QUFDQTs7O0FBRUEsVUFBTUMsU0FBUztBQUNiMUMsV0FBSzhCLGlCQURRO0FBRWI7QUFDQTtBQUNBO0FBQ0FhLG9CQUFjckMsTUFBTWlDLFNBQU4sR0FBa0JOLFNBQWxCLEdBQThCSyxZQUwvQjtBQU1iTSx1QkFBaUJ0QyxNQUFNaUMsU0FBTixHQUFrQk4sU0FBbEIsR0FBOEJLO0FBTmxDLEtBQWY7O0FBU0EsUUFBSUYsV0FBSixFQUFpQjtBQUNmO0FBQ0EsV0FBS1MsT0FBTCxDQUFhLGlCQUFiLEVBQWdDOUMsU0FBaEMsRUFBMkMyQyxNQUEzQztBQUNELEtBSEQsTUFHTztBQUNMO0FBQ0EsV0FBS0ksS0FBTCxDQUFXLGlCQUFYLEVBQThCL0MsU0FBOUIsRUFBeUMyQyxNQUF6QztBQUNBTixvQkFBYyxJQUFkO0FBQ0Q7QUFDRixHQS9CRDs7QUFpQ0EsTUFBSTlCLE1BQU15QyxlQUFWLEVBQTJCO0FBQ3pCO0FBQ0FWLG9CQUFnQjFDLEVBQUVxRCxRQUFGLENBQVc1RCxPQUFPNkQsZUFBUCxDQUF1QlosYUFBdkIsQ0FBWCxFQUFrRC9CLE1BQU15QyxlQUF4RCxDQUFoQjtBQUNEOztBQUVEVjtBQUVBLE9BQUs3QixLQUFMLEdBNUdrRixDQThHbEY7O0FBQ0EsTUFBSTBDLGVBQWUsSUFBbkI7QUFDQSxRQUFNQyxTQUFTdEIsZUFBZXVCLGNBQWYsQ0FBOEI7QUFDM0NOLFdBQU8sVUFBVU8sRUFBVixFQUFjO0FBQ25CLFVBQUlILFlBQUosRUFBa0IsT0FEQyxDQUduQjs7QUFDQXBCLHdCQUFrQndCLElBQWxCLENBQXVCRCxFQUF2QjtBQUNBaEI7QUFDRCxLQVAwQztBQVEzQ2tCLGFBQVMsVUFBVUYsRUFBVixFQUFjO0FBQ3JCO0FBQ0E7QUFDQXZCLDBCQUFvQm5DLEVBQUU2RCxPQUFGLENBQVUxQixpQkFBVixFQUE2Qm5DLEVBQUU4RCxTQUFGLENBQVkzQixpQkFBWixFQUErQnVCLEVBQS9CLENBQTdCLENBQXBCO0FBQ0FoQjtBQUNEO0FBYjBDLEdBQTlCLENBQWY7QUFlQWEsaUJBQWUsS0FBZixDQS9Ia0YsQ0FpSWxGO0FBQ0E7QUFDQTtBQUNBOztBQUNBLFFBQU1RLFdBQVd0RSxPQUFPdUUsV0FBUCxDQUFtQnRCLGFBQW5CLEVBQWtDLEtBQWxDLENBQWpCLENBcklrRixDQXVJbEY7QUFDQTtBQUNBOztBQUNBLE9BQUt1QixNQUFMLENBQVksTUFBTTtBQUNoQnhFLFdBQU95RSxhQUFQLENBQXFCSCxRQUFyQjtBQUNBUCxXQUFPVyxJQUFQO0FBQ0QsR0FIRDtBQUlELENBOUlEO0FBakRBekUsT0FBTzBFLGFBQVAsQ0FpTWVuRSxPQWpNZixFOzs7Ozs7Ozs7OztBQ0FBLElBQUlSLE1BQUo7QUFBV0MsT0FBT0MsS0FBUCxDQUFhQyxRQUFRLGVBQVIsQ0FBYixFQUFzQztBQUFDSCxTQUFPSSxDQUFQLEVBQVM7QUFBQ0osYUFBT0ksQ0FBUDtBQUFTOztBQUFwQixDQUF0QyxFQUE0RCxDQUE1RDtBQUErRCxJQUFJd0UsS0FBSjtBQUFVM0UsT0FBT0MsS0FBUCxDQUFhQyxRQUFRLGNBQVIsQ0FBYixFQUFxQztBQUFDeUUsUUFBTXhFLENBQU4sRUFBUTtBQUFDd0UsWUFBTXhFLENBQU47QUFBUTs7QUFBbEIsQ0FBckMsRUFBeUQsQ0FBekQ7QUFHcEYsTUFBTUksVUFBVSxFQUFoQjtBQUVBQSxRQUFRVyxZQUFSLEdBQXVCLEVBQXZCO0FBRUFYLFFBQVFxRSxLQUFSLEdBQWdCLE1BQU07QUFDcEJDLGNBQVlDLE9BQVosRUFBcUI7QUFDbkIsUUFBSSxDQUFDQSxPQUFMLEVBQWMsTUFBTSxJQUFJN0MsS0FBSixDQUFVLDRDQUFWLENBQU47QUFDZCxRQUFJLENBQUM2QyxRQUFRQyxJQUFiLEVBQW1CLE1BQU0sSUFBSTlDLEtBQUosQ0FBVSx5Q0FBVixDQUFOO0FBQ25CLFFBQUksQ0FBQzZDLFFBQVFFLE9BQWIsRUFBc0IsTUFBTSxJQUFJL0MsS0FBSixDQUFVLDRDQUFWLENBQU47O0FBQ3RCLFFBQUksRUFBRTZDLFFBQVF2RCxVQUFSLFlBQThCb0QsTUFBTU0sVUFBcEMsSUFDREgsUUFBUXZELFVBQVIsWUFBOEJvRCxNQUFNRSxXQURyQyxDQUNpRDtBQURqRCxLQUFKLEVBRUc7QUFDRCxZQUFNLElBQUk1QyxLQUFKLENBQVUsK0NBQVYsQ0FBTjtBQUNEOztBQUVELFNBQUs4QyxJQUFMLEdBQVlELFFBQVFDLElBQXBCO0FBQ0EsU0FBS3hELFVBQUwsR0FBa0J1RCxRQUFRdkQsVUFBMUI7QUFFQSxTQUFLMkQsR0FBTCxHQUFXSixRQUFRSSxHQUFSLElBQWUsb0JBQTFCLENBYm1CLENBZW5CO0FBQ0E7O0FBQ0EsU0FBS0MsR0FBTCxHQUFXTCxRQUFRSyxHQUFSLElBQWVwRixNQUExQjtBQUVBLFNBQUtxRixRQUFMLEdBQWdCTixRQUFRTSxRQUF4QjtBQUNBLFNBQUtoRSxLQUFMLEdBQWEwRCxRQUFRMUQsS0FBckI7QUFDQSxTQUFLRSxXQUFMLEdBQW1Cd0QsUUFBUXhELFdBQTNCO0FBQ0EsU0FBS1ksY0FBTCxHQUFzQjRDLFFBQVE1QyxjQUE5QjtBQUNBLFNBQUt3QixlQUFMLEdBQXVCb0IsUUFBUXBCLGVBQS9CO0FBQ0EsU0FBS1AsZ0JBQUwsR0FBd0IyQixRQUFRM0IsZ0JBQWhDO0FBQ0EsU0FBS0QsU0FBTCxHQUFpQjRCLFFBQVE1QixTQUF6Qjs7QUFFQSxRQUFJNUMsRUFBRWlDLE9BQUYsQ0FBVXVDLFFBQVFPLFdBQWxCLENBQUosRUFBb0M7QUFDbEMsWUFBTXpFLFNBQVMsRUFBZjs7QUFDQU4sUUFBRWdGLElBQUYsQ0FBT1IsUUFBUU8sV0FBZixFQUE0QkUsYUFBYTtBQUN2QzNFLGVBQU8yRSxTQUFQLElBQW9CLENBQXBCO0FBQ0QsT0FGRDs7QUFHQSxXQUFLRixXQUFMLEdBQW1CekUsTUFBbkI7QUFDRDs7QUFFRCxTQUFLZSxRQUFMLEdBQWdCbUQsUUFBUW5ELFFBQXhCO0FBRUEsU0FBS21ELE9BQUwsR0FBZXhFLEVBQUVrRixJQUFGLENBQ2JWLE9BRGEsRUFFYixZQUZhLEVBR2IsS0FIYSxFQUliLEtBSmEsRUFLYixVQUxhLEVBTWIsT0FOYSxFQU9iLGFBUGEsRUFRYixnQkFSYSxFQVNiLGlCQVRhLEVBVWIsYUFWYSxFQVdiLGtCQVhhLEVBWWIsV0FaYSxFQWFiLE1BYmEsRUFjYixVQWRhLENBQWY7QUFpQkF2RSxZQUFRVyxZQUFSLENBQXFCLEtBQUs2RCxJQUExQixJQUFrQyxJQUFsQztBQUNEOztBQXhEbUIsQ0FBdEI7QUFQQS9FLE9BQU8wRSxhQUFQLENBa0VlbkUsT0FsRWYsRSIsImZpbGUiOiIvcGFja2FnZXMvYWxkZWVkX3RhYnVsYXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IGNoZWNrLCBNYXRjaCB9IGZyb20gJ21ldGVvci9jaGVjayc7XG5pbXBvcnQgeyBfIH0gZnJvbSAnbWV0ZW9yL3VuZGVyc2NvcmUnO1xuaW1wb3J0IFRhYnVsYXIgZnJvbSAnLi4vY29tbW9uL1RhYnVsYXInO1xuXG4vKlxuICogVGhlc2UgYXJlIHRoZSB0d28gcHVibGljYXRpb25zIHVzZWQgYnkgVGFidWxhclRhYmxlLlxuICpcbiAqIFRoZSBnZW5lcmljUHViIG9uZSBjYW4gYmUgb3ZlcnJpZGRlbiBieSBzdXBwbHlpbmcgYSBgcHViYFxuICogcHJvcGVydHkgd2l0aCBhIGRpZmZlcmVudCBwdWJsaWNhdGlvbiBuYW1lLiBUaGlzIHB1YmxpY2F0aW9uXG4gKiBpcyBnaXZlbiBvbmx5IHRoZSBsaXN0IG9mIGlkcyBhbmQgcmVxdWVzdGVkIGZpZWxkcy4gWW91IG1heVxuICogd2FudCB0byBvdmVycmlkZSBpdCBpZiB5b3UgbmVlZCB0byBwdWJsaXNoIGRvY3VtZW50cyBmcm9tXG4gKiByZWxhdGVkIGNvbGxlY3Rpb25zIGFsb25nIHdpdGggdGhlIHRhYmxlIGNvbGxlY3Rpb24gZG9jdW1lbnRzLlxuICpcbiAqIFRoZSBnZXRJbmZvIG9uZSBydW5zIGZpcnN0IGFuZCBoYW5kbGVzIGFsbCB0aGUgY29tcGxleCBsb2dpY1xuICogcmVxdWlyZWQgYnkgdGhpcyBwYWNrYWdlLCBzbyB0aGF0IHlvdSBkb24ndCBoYXZlIHRvIGR1cGxpY2F0ZVxuICogdGhpcyBsb2dpYyB3aGVuIG92ZXJyaWRpbmcgdGhlIGdlbmVyaWNQdWIgZnVuY3Rpb24uXG4gKlxuICogSGF2aW5nIHR3byBwdWJsaWNhdGlvbnMgYWxzbyBhbGxvd3MgZmluZS1ncmFpbmVkIGNvbnRyb2wgb2ZcbiAqIHJlYWN0aXZpdHkgb24gdGhlIGNsaWVudC5cbiAqL1xuXG5NZXRlb3IucHVibGlzaCgndGFidWxhcl9nZW5lcmljUHViJywgZnVuY3Rpb24gKHRhYmxlTmFtZSwgaWRzLCBmaWVsZHMpIHtcbiAgY2hlY2sodGFibGVOYW1lLCBTdHJpbmcpO1xuICBjaGVjayhpZHMsIEFycmF5KTtcbiAgY2hlY2soZmllbGRzLCBNYXRjaC5PcHRpb25hbChPYmplY3QpKTtcblxuICBjb25zdCB0YWJsZSA9IFRhYnVsYXIudGFibGVzQnlOYW1lW3RhYmxlTmFtZV07XG4gIGlmICghdGFibGUpIHtcbiAgICAvLyBXZSB0aHJvdyBhbiBlcnJvciBpbiB0aGUgb3RoZXIgcHViLCBzbyBubyBuZWVkIHRvIHRocm93IG9uZSBoZXJlXG4gICAgdGhpcy5yZWFkeSgpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIENoZWNrIHNlY3VyaXR5LiBXZSBjYWxsIHRoaXMgaW4gYm90aCBwdWJsaWNhdGlvbnMuXG4gIGlmICh0eXBlb2YgdGFibGUuYWxsb3cgPT09ICdmdW5jdGlvbicgJiYgIXRhYmxlLmFsbG93KHRoaXMudXNlcklkLCBmaWVsZHMpKSB7XG4gICAgdGhpcy5yZWFkeSgpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIENoZWNrIHNlY3VyaXR5IGZvciBmaWVsZHMuIFdlIGNhbGwgdGhpcyBvbmx5IGluIHRoaXMgcHVibGljYXRpb25cbiAgaWYgKHR5cGVvZiB0YWJsZS5hbGxvd0ZpZWxkcyA9PT0gJ2Z1bmN0aW9uJyAmJiAhdGFibGUuYWxsb3dGaWVsZHModGhpcy51c2VySWQsIGZpZWxkcykpIHtcbiAgICB0aGlzLnJlYWR5KCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgcmV0dXJuIHRhYmxlLmNvbGxlY3Rpb24uZmluZCh7X2lkOiB7JGluOiBpZHN9fSwge2ZpZWxkczogZmllbGRzfSk7XG59KTtcblxuTWV0ZW9yLnB1Ymxpc2goJ3RhYnVsYXJfZ2V0SW5mbycsIGZ1bmN0aW9uICh0YWJsZU5hbWUsIHNlbGVjdG9yLCBzb3J0LCBza2lwLCBsaW1pdCkge1xuICBjaGVjayh0YWJsZU5hbWUsIFN0cmluZyk7XG4gIGNoZWNrKHNlbGVjdG9yLCBNYXRjaC5PcHRpb25hbChNYXRjaC5PbmVPZihPYmplY3QsIG51bGwpKSk7XG4gIGNoZWNrKHNvcnQsIE1hdGNoLk9wdGlvbmFsKE1hdGNoLk9uZU9mKEFycmF5LCBudWxsKSkpO1xuICBjaGVjayhza2lwLCBOdW1iZXIpO1xuICBjaGVjayhsaW1pdCwgTWF0Y2guT3B0aW9uYWwoTWF0Y2guT25lT2YoTnVtYmVyLCBudWxsKSkpO1xuXG4gIGNvbnN0IHRhYmxlID0gVGFidWxhci50YWJsZXNCeU5hbWVbdGFibGVOYW1lXTtcbiAgaWYgKCF0YWJsZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgTm8gVGFidWxhclRhYmxlIGRlZmluZWQgd2l0aCB0aGUgbmFtZSBcIiR7dGFibGVOYW1lfVwiLiBNYWtlIHN1cmUgeW91IGFyZSBkZWZpbmluZyB5b3VyIFRhYnVsYXJUYWJsZSBpbiBjb21tb24gY29kZS5gKTtcbiAgfVxuXG4gIC8vIENoZWNrIHNlY3VyaXR5LiBXZSBjYWxsIHRoaXMgaW4gYm90aCBwdWJsaWNhdGlvbnMuXG4gIC8vIEV2ZW4gdGhvdWdoIHdlJ3JlIG9ubHkgcHVibGlzaGluZyBfaWRzIGFuZCBjb3VudHNcbiAgLy8gZnJvbSB0aGlzIGZ1bmN0aW9uLCB3aXRoIHNlbnNpdGl2ZSBkYXRhLCB0aGVyZSBpc1xuICAvLyBhIGNoYW5jZSBzb21lb25lIGNvdWxkIGRvIGEgcXVlcnkgYW5kIGxlYXJuIHNvbWV0aGluZ1xuICAvLyBqdXN0IGJhc2VkIG9uIHdoZXRoZXIgYSByZXN1bHQgaXMgZm91bmQgb3Igbm90LlxuICBpZiAodHlwZW9mIHRhYmxlLmFsbG93ID09PSAnZnVuY3Rpb24nICYmICF0YWJsZS5hbGxvdyh0aGlzLnVzZXJJZCkpIHtcbiAgICB0aGlzLnJlYWR5KCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgc2VsZWN0b3IgPSBzZWxlY3RvciB8fCB7fTtcblxuICAvLyBBbGxvdyB0aGUgdXNlciB0byBtb2RpZnkgdGhlIHNlbGVjdG9yIGJlZm9yZSB3ZSB1c2UgaXRcbiAgaWYgKHR5cGVvZiB0YWJsZS5jaGFuZ2VTZWxlY3RvciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHNlbGVjdG9yID0gdGFibGUuY2hhbmdlU2VsZWN0b3Ioc2VsZWN0b3IsIHRoaXMudXNlcklkKTtcbiAgfVxuXG4gIC8vIEFwcGx5IHRoZSBzZXJ2ZXIgc2lkZSBzZWxlY3RvciBzcGVjaWZpZWQgaW4gdGhlIHRhYnVsYXJcbiAgLy8gdGFibGUgY29uc3RydWN0b3IuIEJvdGggbXVzdCBiZSBtZXQsIHNvIHdlIGpvaW5cbiAgLy8gdGhlbSB1c2luZyAkYW5kLCBhbGxvd2luZyBib3RoIHNlbGVjdG9ycyB0byBoYXZlXG4gIC8vIHRoZSBzYW1lIGtleXMuXG4gIGlmICh0eXBlb2YgdGFibGUuc2VsZWN0b3IgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjb25zdCB0YWJsZVNlbGVjdG9yID0gdGFibGUuc2VsZWN0b3IodGhpcy51c2VySWQpO1xuICAgIGlmIChfLmlzRW1wdHkoc2VsZWN0b3IpKSB7XG4gICAgICBzZWxlY3RvciA9IHRhYmxlU2VsZWN0b3I7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGVjdG9yID0geyRhbmQ6IFt0YWJsZVNlbGVjdG9yLCBzZWxlY3Rvcl19O1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGZpbmRPcHRpb25zID0ge1xuICAgIHNraXA6IHNraXAsXG4gICAgZmllbGRzOiB7X2lkOiAxfVxuICB9O1xuXG4gIC8vIGBsaW1pdGAgbWF5IGJlIGBudWxsYFxuICBpZiAobGltaXQgPiAwKSB7XG4gICAgZmluZE9wdGlvbnMubGltaXQgPSBsaW1pdDtcbiAgfVxuXG4gIC8vIGBzb3J0YCBtYXkgYmUgYG51bGxgXG4gIGlmIChfLmlzQXJyYXkoc29ydCkpIHtcbiAgICBmaW5kT3B0aW9ucy5zb3J0ID0gc29ydDtcbiAgfVxuXG4gIGNvbnN0IGZpbHRlcmVkQ3Vyc29yID0gdGFibGUuY29sbGVjdGlvbi5maW5kKHNlbGVjdG9yLCBmaW5kT3B0aW9ucyk7XG5cbiAgbGV0IGZpbHRlcmVkUmVjb3JkSWRzID0gZmlsdGVyZWRDdXJzb3IubWFwKGRvYyA9PiBkb2MuX2lkKTtcblxuICAvLyBJZiB3ZSBhcmUgbm90IGdvaW5nIHRvIGNvdW50IGZvciByZWFsLCBpbiBvcmRlciB0byBpbXByb3ZlIHBlcmZvcm1hbmNlLCB0aGVuIHdlIHdpbGwgZmFrZVxuICAvLyB0aGUgY291bnQgdG8gZW5zdXJlIHRoZSBOZXh0IGJ1dHRvbiBpcyBhbHdheXMgYXZhaWxhYmxlLlxuICBjb25zdCBmYWtlQ291bnQgPSBmaWx0ZXJlZFJlY29yZElkcy5sZW5ndGggKyBza2lwICsgMTtcblxuICBjb25zdCBjb3VudEN1cnNvciA9IHRhYmxlLmNvbGxlY3Rpb24uZmluZChzZWxlY3Rvciwge2ZpZWxkczoge19pZDogMX19KTtcblxuICBsZXQgcmVjb3JkUmVhZHkgPSBmYWxzZTtcbiAgbGV0IHVwZGF0ZVJlY29yZHMgPSAoKSA9PiB7XG4gICAgbGV0IGN1cnJlbnRDb3VudDtcbiAgICBpZiAoIXRhYmxlLnNraXBDb3VudCkge1xuICAgICAgaWYgKHR5cGVvZiB0YWJsZS5hbHRlcm5hdGl2ZUNvdW50ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGN1cnJlbnRDb3VudCA9IHRhYmxlLmFsdGVybmF0aXZlQ291bnQoc2VsZWN0b3IpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY3VycmVudENvdW50ID0gY291bnRDdXJzb3IuY291bnQoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBGcm9tIGh0dHBzOi8vZGF0YXRhYmxlcy5uZXQvbWFudWFsL3NlcnZlci1zaWRlXG4gICAgLy8gcmVjb3Jkc1RvdGFsOiBUb3RhbCByZWNvcmRzLCBiZWZvcmUgZmlsdGVyaW5nIChpLmUuIHRoZSB0b3RhbCBudW1iZXIgb2YgcmVjb3JkcyBpbiB0aGUgZGF0YWJhc2UpXG4gICAgLy8gcmVjb3Jkc0ZpbHRlcmVkOiBUb3RhbCByZWNvcmRzLCBhZnRlciBmaWx0ZXJpbmcgKGkuZS4gdGhlIHRvdGFsIG51bWJlciBvZiByZWNvcmRzIGFmdGVyIGZpbHRlcmluZyBoYXMgYmVlbiBhcHBsaWVkIC0gbm90IGp1c3QgdGhlIG51bWJlciBvZiByZWNvcmRzIGJlaW5nIHJldHVybmVkIGZvciB0aGlzIHBhZ2Ugb2YgZGF0YSkuXG5cbiAgICBjb25zdCByZWNvcmQgPSB7XG4gICAgICBpZHM6IGZpbHRlcmVkUmVjb3JkSWRzLFxuICAgICAgLy8gY291bnQoKSB3aWxsIGdpdmUgdXMgdGhlIHVwZGF0ZWQgdG90YWwgY291bnRcbiAgICAgIC8vIGV2ZXJ5IHRpbWUuIEl0IGRvZXMgbm90IHRha2UgdGhlIGZpbmQgb3B0aW9uc1xuICAgICAgLy8gbGltaXQgaW50byBhY2NvdW50LlxuICAgICAgcmVjb3Jkc1RvdGFsOiB0YWJsZS5za2lwQ291bnQgPyBmYWtlQ291bnQgOiBjdXJyZW50Q291bnQsXG4gICAgICByZWNvcmRzRmlsdGVyZWQ6IHRhYmxlLnNraXBDb3VudCA/IGZha2VDb3VudCA6IGN1cnJlbnRDb3VudFxuICAgIH07XG5cbiAgICBpZiAocmVjb3JkUmVhZHkpIHtcbiAgICAgIC8vY29uc29sZS5sb2coJ2NoYW5nZWQnLCB0YWJsZU5hbWUsIHJlY29yZCk7XG4gICAgICB0aGlzLmNoYW5nZWQoJ3RhYnVsYXJfcmVjb3JkcycsIHRhYmxlTmFtZSwgcmVjb3JkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy9jb25zb2xlLmxvZygnYWRkZWQnLCB0YWJsZU5hbWUsIHJlY29yZCk7XG4gICAgICB0aGlzLmFkZGVkKCd0YWJ1bGFyX3JlY29yZHMnLCB0YWJsZU5hbWUsIHJlY29yZCk7XG4gICAgICByZWNvcmRSZWFkeSA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgaWYgKHRhYmxlLnRocm90dGxlUmVmcmVzaCkge1xuICAgIC8vIFdoeSBNZXRlb3IuYmluZEVudmlyb25tZW50PyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2FsZGVlZC9tZXRlb3ItdGFidWxhci9pc3N1ZXMvMjc4I2lzc3VlY29tbWVudC0yMTczMTgxMTJcbiAgICB1cGRhdGVSZWNvcmRzID0gXy50aHJvdHRsZShNZXRlb3IuYmluZEVudmlyb25tZW50KHVwZGF0ZVJlY29yZHMpLCB0YWJsZS50aHJvdHRsZVJlZnJlc2gpO1xuICB9XG5cbiAgdXBkYXRlUmVjb3JkcygpO1xuXG4gIHRoaXMucmVhZHkoKTtcblxuICAvLyBIYW5kbGUgZG9jcyBiZWluZyBhZGRlZCBvciByZW1vdmVkIGZyb20gdGhlIHJlc3VsdCBzZXQuXG4gIGxldCBpbml0aWFsaXppbmcgPSB0cnVlO1xuICBjb25zdCBoYW5kbGUgPSBmaWx0ZXJlZEN1cnNvci5vYnNlcnZlQ2hhbmdlcyh7XG4gICAgYWRkZWQ6IGZ1bmN0aW9uIChpZCkge1xuICAgICAgaWYgKGluaXRpYWxpemluZykgcmV0dXJuO1xuXG4gICAgICAvL2NvbnNvbGUubG9nKCdBRERFRCcpO1xuICAgICAgZmlsdGVyZWRSZWNvcmRJZHMucHVzaChpZCk7XG4gICAgICB1cGRhdGVSZWNvcmRzKCk7XG4gICAgfSxcbiAgICByZW1vdmVkOiBmdW5jdGlvbiAoaWQpIHtcbiAgICAgIC8vY29uc29sZS5sb2coJ1JFTU9WRUQnKTtcbiAgICAgIC8vIF8uZmluZFdoZXJlIGlzIHVzZWQgdG8gc3VwcG9ydCBNb25nbyBPYmplY3RJRHNcbiAgICAgIGZpbHRlcmVkUmVjb3JkSWRzID0gXy53aXRob3V0KGZpbHRlcmVkUmVjb3JkSWRzLCBfLmZpbmRXaGVyZShmaWx0ZXJlZFJlY29yZElkcywgaWQpKTtcbiAgICAgIHVwZGF0ZVJlY29yZHMoKTtcbiAgICB9XG4gIH0pO1xuICBpbml0aWFsaXppbmcgPSBmYWxzZTtcblxuICAvLyBJdCBpcyB0b28gaW5lZmZpY2llbnQgdG8gdXNlIGFuIG9ic2VydmUgd2l0aG91dCBhbnkgbGltaXRzIHRvIHRyYWNrIGNvdW50IHBlcmZlY3RseVxuICAvLyBhY2N1cmF0ZWx5IHdoZW4sIGZvciBleGFtcGxlLCB0aGUgc2VsZWN0b3IgaXMge30gYW5kIHRoZXJlIGFyZSBhIG1pbGxpb24gZG9jdW1lbnRzLlxuICAvLyBJbnN0ZWFkIHdlIHdpbGwgdXBkYXRlIHRoZSBjb3VudCBldmVyeSAxMCBzZWNvbmRzLCBpbiBhZGRpdGlvbiB0byB3aGVuZXZlciB0aGUgbGltaXRlZFxuICAvLyByZXN1bHQgc2V0IGNoYW5nZXMuXG4gIGNvbnN0IGludGVydmFsID0gTWV0ZW9yLnNldEludGVydmFsKHVwZGF0ZVJlY29yZHMsIDEwMDAwKTtcblxuICAvLyBTdG9wIG9ic2VydmluZyB0aGUgY3Vyc29ycyB3aGVuIGNsaWVudCB1bnN1YnMuXG4gIC8vIFN0b3BwaW5nIGEgc3Vic2NyaXB0aW9uIGF1dG9tYXRpY2FsbHkgdGFrZXNcbiAgLy8gY2FyZSBvZiBzZW5kaW5nIHRoZSBjbGllbnQgYW55IHJlbW92ZWQgbWVzc2FnZXMuXG4gIHRoaXMub25TdG9wKCgpID0+IHtcbiAgICBNZXRlb3IuY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgaGFuZGxlLnN0b3AoKTtcbiAgfSk7XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgVGFidWxhcjtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgTW9uZ28gfSBmcm9tICdtZXRlb3IvbW9uZ28nO1xuXG5jb25zdCBUYWJ1bGFyID0ge307XG5cblRhYnVsYXIudGFibGVzQnlOYW1lID0ge307XG5cblRhYnVsYXIuVGFibGUgPSBjbGFzcyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBpZiAoIW9wdGlvbnMpIHRocm93IG5ldyBFcnJvcignVGFidWxhci5UYWJsZSBvcHRpb25zIGFyZ3VtZW50IGlzIHJlcXVpcmVkJyk7XG4gICAgaWYgKCFvcHRpb25zLm5hbWUpIHRocm93IG5ldyBFcnJvcignVGFidWxhci5UYWJsZSBvcHRpb25zIG11c3Qgc3BlY2lmeSBuYW1lJyk7XG4gICAgaWYgKCFvcHRpb25zLmNvbHVtbnMpIHRocm93IG5ldyBFcnJvcignVGFidWxhci5UYWJsZSBvcHRpb25zIG11c3Qgc3BlY2lmeSBjb2x1bW5zJyk7XG4gICAgaWYgKCEob3B0aW9ucy5jb2xsZWN0aW9uIGluc3RhbmNlb2YgTW9uZ28uQ29sbGVjdGlvblxuICAgICAgfHwgb3B0aW9ucy5jb2xsZWN0aW9uIGluc3RhbmNlb2YgTW9uZ28uY29uc3RydWN0b3IgLy8gRml4OiBlcnJvciBpZiBgY29sbGVjdGlvbjogTWV0ZW9yLnVzZXJzYFxuICAgICkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVGFidWxhci5UYWJsZSBvcHRpb25zIG11c3Qgc3BlY2lmeSBjb2xsZWN0aW9uJyk7XG4gICAgfVxuXG4gICAgdGhpcy5uYW1lID0gb3B0aW9ucy5uYW1lO1xuICAgIHRoaXMuY29sbGVjdGlvbiA9IG9wdGlvbnMuY29sbGVjdGlvbjtcblxuICAgIHRoaXMucHViID0gb3B0aW9ucy5wdWIgfHwgJ3RhYnVsYXJfZ2VuZXJpY1B1Yic7XG5cbiAgICAvLyBCeSBkZWZhdWx0IHdlIHVzZSBjb3JlIGBNZXRlb3Iuc3Vic2NyaWJlYCwgYnV0IHlvdSBjYW4gcGFzc1xuICAgIC8vIGEgc3Vic2NyaXB0aW9uIG1hbmFnZXIgbGlrZSBgc3ViOiBuZXcgU3Vic01hbmFnZXIoe2NhY2hlTGltaXQ6IDIwLCBleHBpcmVJbjogM30pYFxuICAgIHRoaXMuc3ViID0gb3B0aW9ucy5zdWIgfHwgTWV0ZW9yO1xuXG4gICAgdGhpcy5vblVubG9hZCA9IG9wdGlvbnMub25VbmxvYWQ7XG4gICAgdGhpcy5hbGxvdyA9IG9wdGlvbnMuYWxsb3c7XG4gICAgdGhpcy5hbGxvd0ZpZWxkcyA9IG9wdGlvbnMuYWxsb3dGaWVsZHM7XG4gICAgdGhpcy5jaGFuZ2VTZWxlY3RvciA9IG9wdGlvbnMuY2hhbmdlU2VsZWN0b3I7XG4gICAgdGhpcy50aHJvdHRsZVJlZnJlc2ggPSBvcHRpb25zLnRocm90dGxlUmVmcmVzaDtcbiAgICB0aGlzLmFsdGVybmF0aXZlQ291bnQgPSBvcHRpb25zLmFsdGVybmF0aXZlQ291bnQ7XG4gICAgdGhpcy5za2lwQ291bnQgPSBvcHRpb25zLnNraXBDb3VudDtcblxuICAgIGlmIChfLmlzQXJyYXkob3B0aW9ucy5leHRyYUZpZWxkcykpIHtcbiAgICAgIGNvbnN0IGZpZWxkcyA9IHt9O1xuICAgICAgXy5lYWNoKG9wdGlvbnMuZXh0cmFGaWVsZHMsIGZpZWxkTmFtZSA9PiB7XG4gICAgICAgIGZpZWxkc1tmaWVsZE5hbWVdID0gMTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5leHRyYUZpZWxkcyA9IGZpZWxkcztcbiAgICB9XG5cbiAgICB0aGlzLnNlbGVjdG9yID0gb3B0aW9ucy5zZWxlY3RvcjtcblxuICAgIHRoaXMub3B0aW9ucyA9IF8ub21pdChcbiAgICAgIG9wdGlvbnMsXG4gICAgICAnY29sbGVjdGlvbicsXG4gICAgICAncHViJyxcbiAgICAgICdzdWInLFxuICAgICAgJ29uVW5sb2FkJyxcbiAgICAgICdhbGxvdycsXG4gICAgICAnYWxsb3dGaWVsZHMnLFxuICAgICAgJ2NoYW5nZVNlbGVjdG9yJyxcbiAgICAgICd0aHJvdHRsZVJlZnJlc2gnLFxuICAgICAgJ2V4dHJhRmllbGRzJyxcbiAgICAgICdhbHRlcm5hdGl2ZUNvdW50JyxcbiAgICAgICdza2lwQ291bnQnLFxuICAgICAgJ25hbWUnLFxuICAgICAgJ3NlbGVjdG9yJ1xuICAgICk7XG5cbiAgICBUYWJ1bGFyLnRhYmxlc0J5TmFtZVt0aGlzLm5hbWVdID0gdGhpcztcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBUYWJ1bGFyO1xuIl19
