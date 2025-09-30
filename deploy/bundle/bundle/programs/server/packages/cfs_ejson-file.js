(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var FS = Package['cfs:base-package'].FS;
var EJSON = Package.ejson.EJSON;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                         //
// packages/cfs_ejson-file/packages/cfs_ejson-file.js                                      //
//                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////
                                                                                           //
(function () {

///////////////////////////////////////////////////////////////////////////////////////
//                                                                                   //
// packages/cfs:ejson-file/fsFile-ejson.js                                           //
//                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////
                                                                                     //
// EJSON custom type                                                                 // 1
FS.File.prototype.typeName = function() {                                            // 2
  return 'FS.File';                                                                  // 3
};                                                                                   // 4
                                                                                     // 5
// EJSON equals type                                                                 // 6
FS.File.prototype.equals = function(other) {                                         // 7
  var self = this;                                                                   // 8
  if (other instanceof FS.File) {                                                    // 9
    return (self._id === other._id && self.collectionName === other.collectionName); // 10
  }                                                                                  // 11
  return false;                                                                      // 12
};                                                                                   // 13
                                                                                     // 14
// EJSON custom clone                                                                // 15
FS.File.prototype.clone = function() {                                               // 16
  return new FS.File(this);                                                          // 17
};                                                                                   // 18
                                                                                     // 19
// EJSON toJSONValue                                                                 // 20
FS.File.prototype.toJSONValue = function() {                                         // 21
  var self = this;                                                                   // 22
  return { _id: self._id, collectionName: self.collectionName };                     // 23
};                                                                                   // 24
                                                                                     // 25
// EJSON fromJSONValue                                                               // 26
FS.File.fromJSONValue = function(value) {                                            // 27
  return new FS.File(value);                                                         // 28
};                                                                                   // 29
                                                                                     // 30
EJSON.addType('FS.File', FS.File.fromJSONValue);                                     // 31
///////////////////////////////////////////////////////////////////////////////////////

}).call(this);

/////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
Package._define("cfs:ejson-file");

})();
