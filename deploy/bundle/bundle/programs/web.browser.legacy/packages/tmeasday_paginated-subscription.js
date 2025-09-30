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

/* Package-scope variables */
var PaginatedSubscriptionHandle;

(function(){

///////////////////////////////////////////////////////////////////////////////////////
//                                                                                   //
// packages/tmeasday_paginated-subscription/packages/tmeasday_paginated-subscription //
//                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////
                                                                                     //
(function () {

/////////////////////////////////////////////////////////////////////////////////
//                                                                             //
// packages/tmeasday:paginated-subscription/paginated_subscription.js          //
//                                                                             //
/////////////////////////////////////////////////////////////////////////////////
                                                                               //
PaginatedSubscriptionHandle = function(perPage) {                              // 1
  this.perPage = perPage;                                                      // 2
  this._limit = perPage;                                                       // 3
  this._limitListeners = new Deps.Dependency();                                // 4
  this._loaded = 0;                                                            // 5
  this._loadedListeners = new Deps.Dependency();                               // 6
}                                                                              // 7
                                                                               // 8
PaginatedSubscriptionHandle.prototype.loaded = function() {                    // 9
  this._loadedListeners.depend();                                              // 10
  return this._loaded;                                                         // 11
}                                                                              // 12
                                                                               // 13
PaginatedSubscriptionHandle.prototype.limit = function() {                     // 14
  this._limitListeners.depend();                                               // 15
  return this._limit;                                                          // 16
}                                                                              // 17
                                                                               // 18
PaginatedSubscriptionHandle.prototype.ready = function() {                     // 19
  return this.loaded() === this.limit();                                       // 20
}                                                                              // 21
                                                                               // 22
// deprecated                                                                  // 23
PaginatedSubscriptionHandle.prototype.loading = function() {                   // 24
  return ! this.ready();                                                       // 25
}                                                                              // 26
                                                                               // 27
PaginatedSubscriptionHandle.prototype.loadNextPage = function() {              // 28
  this._limit += this.perPage;                                                 // 29
  this._limitListeners.changed();                                              // 30
}                                                                              // 31
                                                                               // 32
PaginatedSubscriptionHandle.prototype.done = function() {                      // 33
  this._loaded = this._limit;                                                  // 34
  this._loadedListeners.changed();                                             // 35
}                                                                              // 36
                                                                               // 37
PaginatedSubscriptionHandle.prototype.reset = function() {                     // 38
  this._limit = this.perPage;                                                  // 39
  this._limitListeners.changed();                                              // 40
}                                                                              // 41
                                                                               // 42
                                                                               // 43
Meteor.subscribeWithPagination = function (/*name, arguments, perPage */) {    // 44
  var args = Array.prototype.slice.call(arguments, 0);                         // 45
  var lastArg = args.pop();                                                    // 46
  var perPage, cb;                                                             // 47
  if (_.isFunction(lastArg) || _.isObject(lastArg)) {                          // 48
    cb = lastArg;                                                              // 49
    perPage = args.pop();                                                      // 50
  } else {                                                                     // 51
    perPage = lastArg;                                                         // 52
  }                                                                            // 53
                                                                               // 54
  var handle = new PaginatedSubscriptionHandle(perPage);                       // 55
                                                                               // 56
  var argAutorun = Meteor.autorun(function() {                                 // 57
    var ourArgs = _.map(args, function(arg) {                                  // 58
      return _.isFunction(arg) ? arg() : arg;                                  // 59
    });                                                                        // 60
                                                                               // 61
    ourArgs.push(handle.limit());                                              // 62
    cb && ourArgs.push(cb);                                                    // 63
    var subHandle = Meteor.subscribe.apply(this, ourArgs);                     // 64
                                                                               // 65
    // whenever the sub becomes ready, we are done. This may happen right away // 66
    // if we are re-subscribing to an already ready subscription.              // 67
    Meteor.autorun(function() {                                                // 68
      if (subHandle.ready())                                                   // 69
        handle.done();                                                         // 70
    });                                                                        // 71
  });                                                                          // 72
                                                                               // 73
  // this will stop the subHandle, and the done autorun                        // 74
  handle.stop = _.bind(argAutorun.stop, argAutorun);                           // 75
                                                                               // 76
  return handle;                                                               // 77
}                                                                              // 78
                                                                               // 79
/////////////////////////////////////////////////////////////////////////////////

}).call(this);

///////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
Package._define("tmeasday:paginated-subscription");

})();
