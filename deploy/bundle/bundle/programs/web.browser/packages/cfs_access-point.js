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
var FS = Package['cfs:base-package'].FS;
var check = Package.check.check;
var Match = Package.check.Match;
var EJSON = Package.ejson.EJSON;
var HTTP = Package['cfs:http-methods'].HTTP;

/* Package-scope variables */
var baseUrl;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cfs_access-point/packages/cfs_access-point.js                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/cfs:access-point/access-point-common.js                                                               //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
baseUrl = '/cfs';                                                                                                 // 1
FS.HTTP = FS.HTTP || {};                                                                                          // 2
                                                                                                                  // 3
// Note the upload URL so that client uploader packages know what it is                                           // 4
FS.HTTP.uploadUrl = baseUrl + '/files';                                                                           // 5
                                                                                                                  // 6
/**                                                                                                               // 7
 * @method FS.HTTP.setBaseUrl                                                                                     // 8
 * @public                                                                                                        // 9
 * @param {String} newBaseUrl - Change the base URL for the HTTP GET and DELETE endpoints.                        // 10
 * @returns {undefined}                                                                                           // 11
 */                                                                                                               // 12
FS.HTTP.setBaseUrl = function setBaseUrl(newBaseUrl) {                                                            // 13
                                                                                                                  // 14
  // Adjust the baseUrl if necessary                                                                              // 15
  if (newBaseUrl.slice(0, 1) !== '/') {                                                                           // 16
    newBaseUrl = '/' + newBaseUrl;                                                                                // 17
  }                                                                                                               // 18
  if (newBaseUrl.slice(-1) === '/') {                                                                             // 19
    newBaseUrl = newBaseUrl.slice(0, -1);                                                                         // 20
  }                                                                                                               // 21
                                                                                                                  // 22
  // Update the base URL                                                                                          // 23
  baseUrl = newBaseUrl;                                                                                           // 24
                                                                                                                  // 25
  // Change the upload URL so that client uploader packages know what it is                                       // 26
  FS.HTTP.uploadUrl = baseUrl + '/files';                                                                         // 27
                                                                                                                  // 28
  // Remount URLs with the new baseUrl, unmounting the old, on the server only.                                   // 29
  // If existingMountPoints is empty, then we haven't run the server startup                                      // 30
  // code yet, so this new URL will be used at that point for the initial mount.                                  // 31
  if (Meteor.isServer && !FS.Utility.isEmpty(_existingMountPoints)) {                                             // 32
    mountUrls();                                                                                                  // 33
  }                                                                                                               // 34
};                                                                                                                // 35
                                                                                                                  // 36
/*                                                                                                                // 37
 * FS.File extensions                                                                                             // 38
 */                                                                                                               // 39
                                                                                                                  // 40
/**                                                                                                               // 41
 * @method FS.File.prototype.url Construct the file url                                                           // 42
 * @public                                                                                                        // 43
 * @param {Object} [options]                                                                                      // 44
 * @param {String} [options.store] Name of the store to get from. If not defined, the first store defined in `options.stores` for the collection on the client is used.
 * @param {Boolean} [options.auth=null] Add authentication token to the URL query string? By default, a token for the current logged in user is added on the client. Set this to `false` to omit the token. Set this to a string to provide your own token. Set this to a number to specify an expiration time for the token in seconds.
 * @param {Boolean} [options.download=false] Should headers be set to force a download? Typically this means that clicking the link with this URL will download the file to the user's Downloads folder instead of displaying the file in the browser.
 * @param {Boolean} [options.brokenIsFine=false] Return the URL even if we know it's currently a broken link because the file hasn't been saved in the requested store yet.
 * @param {Boolean} [options.metadata=false] Return the URL for the file metadata access point rather than the file itself.
 * @param {String} [options.uploading=null] A URL to return while the file is being uploaded.                     // 50
 * @param {String} [options.storing=null] A URL to return while the file is being stored.                         // 51
 * @param {String} [options.filename=null] Override the filename that should appear at the end of the URL. By default it is the name of the file in the requested store.
 *                                                                                                                // 53
 * Returns the HTTP URL for getting the file or its metadata.                                                     // 54
 */                                                                                                               // 55
FS.File.prototype.url = function(options) {                                                                       // 56
  var self = this;                                                                                                // 57
  options = options || {};                                                                                        // 58
  options = FS.Utility.extend({                                                                                   // 59
    store: null,                                                                                                  // 60
    auth: null,                                                                                                   // 61
    download: false,                                                                                              // 62
    metadata: false,                                                                                              // 63
    brokenIsFine: false,                                                                                          // 64
    uploading: null, // return this URL while uploading                                                           // 65
    storing: null, // return this URL while storing                                                               // 66
    filename: null // override the filename that is shown to the user                                             // 67
  }, options.hash || options); // check for "hash" prop if called as helper                                       // 68
                                                                                                                  // 69
  // Primarily useful for displaying a temporary image while uploading an image                                   // 70
  if (options.uploading && !self.isUploaded()) {                                                                  // 71
    return options.uploading;                                                                                     // 72
  }                                                                                                               // 73
                                                                                                                  // 74
  if (self.isMounted()) {                                                                                         // 75
    // See if we've stored in the requested store yet                                                             // 76
    var storeName = options.store || self.collection.primaryStore.name;                                           // 77
    if (!self.hasStored(storeName)) {                                                                             // 78
      if (options.storing) {                                                                                      // 79
        return options.storing;                                                                                   // 80
      } else if (!options.brokenIsFine) {                                                                         // 81
        // We want to return null if we know the URL will be a broken                                             // 82
        // link because then we can avoid rendering broken links, broken                                          // 83
        // images, etc.                                                                                           // 84
        return null;                                                                                              // 85
      }                                                                                                           // 86
    }                                                                                                             // 87
                                                                                                                  // 88
    // Add filename to end of URL if we can determine one                                                         // 89
    var filename = options.filename || self.name({store: storeName});                                             // 90
    if (typeof filename === "string" && filename.length) {                                                        // 91
      filename = '/' + filename;                                                                                  // 92
    } else {                                                                                                      // 93
      filename = '';                                                                                              // 94
    }                                                                                                             // 95
                                                                                                                  // 96
    // TODO: Could we somehow figure out if the collection requires login?                                        // 97
    var authToken = '';                                                                                           // 98
    if (Meteor.isClient && typeof Accounts !== "undefined" && typeof Accounts._storedLoginToken === "function") { // 99
      if (options.auth !== false) {                                                                               // 100
        // Add reactive deps on the user                                                                          // 101
        Meteor.userId();                                                                                          // 102
                                                                                                                  // 103
        var authObject = {                                                                                        // 104
          authToken: Accounts._storedLoginToken() || ''                                                           // 105
        };                                                                                                        // 106
                                                                                                                  // 107
        // If it's a number, we use that as the expiration time (in seconds)                                      // 108
        if (options.auth === +options.auth) {                                                                     // 109
          authObject.expiration = FS.HTTP.now() + options.auth * 1000;                                            // 110
        }                                                                                                         // 111
                                                                                                                  // 112
        // Set the authToken                                                                                      // 113
        var authString = JSON.stringify(authObject);                                                              // 114
        authToken = FS.Utility.btoa(authString);                                                                  // 115
      }                                                                                                           // 116
    } else if (typeof options.auth === "string") {                                                                // 117
      // If the user supplies auth token the user will be responsible for                                         // 118
      // updating                                                                                                 // 119
      authToken = options.auth;                                                                                   // 120
    }                                                                                                             // 121
                                                                                                                  // 122
    // Construct query string                                                                                     // 123
    var params = {};                                                                                              // 124
    if (authToken !== '') {                                                                                       // 125
      params.token = authToken;                                                                                   // 126
    }                                                                                                             // 127
    if (options.download) {                                                                                       // 128
      params.download = true;                                                                                     // 129
    }                                                                                                             // 130
    if (options.store) {                                                                                          // 131
      // We use options.store here instead of storeName because we want to omit the queryString                   // 132
      // whenever possible, allowing users to have "clean" URLs if they want. The server will                     // 133
      // assume the first store defined on the server, which means that we are assuming that                      // 134
      // the first on the client is also the first on the server. If that's not the case, the                     // 135
      // store option should be supplied.                                                                         // 136
      params.store = options.store;                                                                               // 137
    }                                                                                                             // 138
    var queryString = FS.Utility.encodeParams(params);                                                            // 139
    if (queryString.length) {                                                                                     // 140
      queryString = '?' + queryString;                                                                            // 141
    }                                                                                                             // 142
                                                                                                                  // 143
    // Determine which URL to use                                                                                 // 144
    var area;                                                                                                     // 145
    if (options.metadata) {                                                                                       // 146
      area = '/record';                                                                                           // 147
    } else {                                                                                                      // 148
      area = '/files';                                                                                            // 149
    }                                                                                                             // 150
                                                                                                                  // 151
    // Construct and return the http method url                                                                   // 152
    return baseUrl + area + '/' + self.collection.name + '/' + self._id + filename + queryString;                 // 153
  }                                                                                                               // 154
                                                                                                                  // 155
};                                                                                                                // 156
                                                                                                                  // 157
                                                                                                                  // 158
                                                                                                                  // 159
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/cfs:access-point/access-point-client.js                                                               //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
FS.HTTP.setHeadersForGet = function setHeadersForGet() {                                                          // 1
  // Client Stub                                                                                                  // 2
};                                                                                                                // 3
                                                                                                                  // 4
FS.HTTP.now = function() {                                                                                        // 5
  return Date.now() + FS.HTTP._serverTimeDiff;                                                                    // 6
};                                                                                                                // 7
                                                                                                                  // 8
// Returns the localstorage if its found and working                                                              // 9
// TODO: check if this works in IE                                                                                // 10
// could use Meteor._localStorage - just needs a rewrite                                                          // 11
FS.HTTP._storage = function() {                                                                                   // 12
  var storage,                                                                                                    // 13
      fail,                                                                                                       // 14
      uid;                                                                                                        // 15
  try {                                                                                                           // 16
    uid = "test";                                                                                                 // 17
    (storage = window.localStorage).setItem(uid, uid);                                                            // 18
    fail = (storage.getItem(uid) !== uid);                                                                        // 19
    storage.removeItem(uid);                                                                                      // 20
    if (fail) {                                                                                                   // 21
      storage = false;                                                                                            // 22
    }                                                                                                             // 23
  } catch(e) {                                                                                                    // 24
    console.log("Error initializing storage for FS.HTTP");                                                        // 25
    console.log(e);                                                                                               // 26
  }                                                                                                               // 27
                                                                                                                  // 28
  return storage;                                                                                                 // 29
};                                                                                                                // 30
                                                                                                                  // 31
// get our storage if found                                                                                       // 32
FS.HTTP.storage = FS.HTTP._storage();                                                                             // 33
                                                                                                                  // 34
FS.HTTP._prefix = 'fsHTTP.';                                                                                      // 35
                                                                                                                  // 36
FS.HTTP._serverTimeDiff = 0; // Time difference in ms                                                             // 37
                                                                                                                  // 38
if (FS.HTTP.storage) {                                                                                            // 39
  // Initialize the FS.HTTP._serverTimeDiff                                                                       // 40
  FS.HTTP._serverTimeDiff = (1*FS.HTTP.storage.getItem(FS.HTTP._prefix+'timeDiff')) || 0;                         // 41
  // At client startup we figure out the time difference between server and                                       // 42
  // client time - this includes lag and timezone                                                                 // 43
  Meteor.startup(function() {                                                                                     // 44
    // Call the server method an get server time                                                                  // 45
    HTTP.get('/cfs/servertime', function(error, result) {                                                         // 46
      if (!error) {                                                                                               // 47
        // Update our server time diff                                                                            // 48
        var dateNew = new Date(+result.content);                                                                  // 49
        FS.HTTP._serverTimeDiff = dateNew - Date.now();// - lag or/and timezone                                   // 50
        // Update the localstorage                                                                                // 51
        FS.HTTP.storage.setItem(FS.HTTP._prefix + 'timeDiff', FS.HTTP._serverTimeDiff);                           // 52
      } else {                                                                                                    // 53
      	console.log(error.message);                                                                                // 54
      }                                                                                                           // 55
    }); // EO Server call                                                                                         // 56
  });                                                                                                             // 57
}                                                                                                                 // 58
                                                                                                                  // 59
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
Package._define("cfs:access-point");

})();
