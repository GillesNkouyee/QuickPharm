(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;

/* Package-scope variables */
var ServerTime;

(function(){

/////////////////////////////////////////////////////////////////////////////
//                                                                         //
// packages/socialize_server-time/packages/socialize_server-time.js        //
//                                                                         //
/////////////////////////////////////////////////////////////////////////////
                                                                           //
(function () {

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/socialize:server-time/common/server-time.js              //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
ServerTime = {                                                       // 1
    _timeDifference: 0                                               // 2
};                                                                   // 3
                                                                     // 4
ServerTime.now = function () {                                       // 5
    return Date.now() + this._timeDifference;                        // 6
};                                                                   // 7
                                                                     // 8
ServerTime.date = function() {                                       // 9
    return new Date(this.now());                                     // 10
};                                                                   // 11
///////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/socialize:server-time/server/server-time.js              //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
Meteor.methods({                                                     // 1
    'socialize:getServerTime': function() {                          // 2
        return Date.now();                                           // 3
    }                                                                // 4
});                                                                  // 5
                                                                     // 6
// Unify client / server api                                         // 7
ServerTime.now = function() {                                        // 8
    return Date.now();                                               // 9
};                                                                   // 10
                                                                     // 11
///////////////////////////////////////////////////////////////////////

}).call(this);

/////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
Package._define("socialize:server-time", {
  ServerTime: ServerTime
});

})();
