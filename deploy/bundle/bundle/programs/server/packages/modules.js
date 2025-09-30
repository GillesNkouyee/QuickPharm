(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var meteorInstall = Package['modules-runtime'].meteorInstall;

var require = meteorInstall({"node_modules":{"meteor":{"modules":{"server.js":function(require){

////////////////////////////////////////////////////////////////////////////////////////
//                                                                                    //
// packages/modules/server.js                                                         //
//                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////
                                                                                      //
require("./install-packages.js");
require("./process.js");
require("./reify.js");

////////////////////////////////////////////////////////////////////////////////////////

},"install-packages.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////
//                                                                                    //
// packages/modules/install-packages.js                                               //
//                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////
                                                                                      //
function install(name, mainModule) {
  var meteorDir = {};

  // Given a package name <name>, install a stub module in the
  // /node_modules/meteor directory called <name>.js, so that
  // require.resolve("meteor/<name>") will always return
  // /node_modules/meteor/<name>.js instead of something like
  // /node_modules/meteor/<name>/index.js, in the rare but possible event
  // that the package contains a file called index.js (#6590).

  if (typeof mainModule === "string") {
    // Set up an alias from /node_modules/meteor/<package>.js to the main
    // module, e.g. meteor/<package>/index.js.
    meteorDir[name + ".js"] = mainModule;
  } else {
    // back compat with old Meteor packages
    meteorDir[name + ".js"] = function (r, e, module) {
      module.exports = Package[name];
    };
  }

  meteorInstall({
    node_modules: {
      meteor: meteorDir
    }
  });
}

// This file will be modified during computeJsOutputFilesMap to include
// install(<name>) calls for every Meteor package.

install("meteor");
install("meteor-base");
install("mobile-experience");
install("npm-mongo");
install("ecmascript-runtime");
install("modules-runtime");
install("modules", "meteor/modules/server.js");
install("modern-browsers", "meteor/modern-browsers/modern.js");
install("es5-shim");
install("promise", "meteor/promise/server.js");
install("ecmascript-runtime-client", "meteor/ecmascript-runtime-client/versions.js");
install("ecmascript-runtime-server", "meteor/ecmascript-runtime-server/runtime.js");
install("babel-compiler");
install("ecmascript");
install("babel-runtime", "meteor/babel-runtime/babel-runtime.js");
install("url", "meteor/url/url_server.js");
install("http", "meteor/http/httpcall_server.js");
install("dynamic-import", "meteor/dynamic-import/server.js");
install("base64", "meteor/base64/base64.js");
install("ejson", "meteor/ejson/ejson.js");
install("diff-sequence", "meteor/diff-sequence/diff.js");
install("geojson-utils", "meteor/geojson-utils/main.js");
install("id-map", "meteor/id-map/id-map.js");
install("random");
install("mongo-id", "meteor/mongo-id/id.js");
install("ordered-dict", "meteor/ordered-dict/ordered_dict.js");
install("tracker");
install("minimongo", "meteor/minimongo/minimongo_server.js");
install("check", "meteor/check/match.js");
install("retry", "meteor/retry/retry.js");
install("callback-hook", "meteor/callback-hook/hook.js");
install("ddp-common");
install("reload");
install("socket-stream-client", "meteor/socket-stream-client/node.js");
install("ddp-client", "meteor/ddp-client/server/server.js");
install("underscore");
install("rate-limit", "meteor/rate-limit/rate-limit.js");
install("ddp-rate-limiter");
install("logging", "meteor/logging/logging.js");
install("routepolicy", "meteor/routepolicy/main.js");
install("boilerplate-generator", "meteor/boilerplate-generator/generator.js");
install("webapp-hashing");
install("webapp", "meteor/webapp/webapp_server.js");
install("ddp-server");
install("ddp");
install("allow-deny");
install("binary-heap");
install("mongo");
install("blaze-html-templates");
install("reactive-var");
install("shell-server", "meteor/shell-server/main.js");
install("session");
install("jquery");
install("observe-sequence");
install("deps");
install("htmljs");
install("blaze");
install("ui");
install("spacebars");
install("templating-compiler");
install("templating-runtime");
install("templating");
install("iron:core");
install("iron:dynamic-template");
install("iron:layout");
install("iron:url");
install("iron:middleware-stack");
install("iron:location");
install("reactive-dict", "meteor/reactive-dict/migration.js");
install("iron:controller");
install("iron:router");
install("accounts-base", "meteor/accounts-base/server_main.js");
install("alanning:roles");
install("accounts-ui");
install("npm-bcrypt", "meteor/npm-bcrypt/wrapper.js");
install("sha");
install("srp");
install("email");
install("accounts-password");
install("service-configuration");
install("localstorage");
install("oauth");
install("accounts-oauth");
install("oauth2");
install("facebook-oauth");
install("accounts-facebook");
install("google-oauth", "meteor/google-oauth/namespace.js");
install("accounts-google");
install("oauth1");
install("twitter-oauth");
install("accounts-twitter");
install("aldeed:simple-schema");
install("raix:eventemitter");
install("aldeed:collection2-core");
install("aldeed:schema-index");
install("aldeed:schema-deny");
install("aldeed:collection2");
install("aldeed:autoform");
install("cfs:standard-packages");
install("cfs:base-package");
install("livedata");
install("mongo-livedata");
install("cfs:graphicsmagick");
install("cfs:storage-adapter");
install("cfs:data-man");
install("cfs:file");
install("cfs:filesystem");
install("cfs:tempstore");
install("cfs:http-methods");
install("cfs:http-publish");
install("cfs:access-point");
install("cfs:reactive-property");
install("cfs:reactive-list");
install("cfs:power-queue");
install("cfs:upload-http");
install("cfs:collection");
install("cfs:collection-filters");
install("cfs:worker");
install("cfs:autoform");
install("stef:import-export-excel");
install("flemay:less-autoprefixer");
install("momentjs:moment");
install("jss:spinner");
install("socialize:server-time");
install("matb33:collection-hooks");
install("socialize:base-model", "meteor/socialize:base-model/base-model.js");
install("dburles:google-maps");
install("mdg:geolocation");
install("abdj:autoform-google-places-input");
install("chrismbeckett:toastr");
install("aldeed:tabular", "meteor/aldeed:tabular/server/main.js");
install("semantic:ui");
install("twbs:bootstrap");
install("joshowens:shareit");
install("helmy:smshelper");
install("inno:zoom");
install("tomi:upload-server");
install("harrison:papa-parse");
install("html-tools");
install("blaze-tools");
install("spacebars-compiler");
install("meteorhacks:ssr");
install("cfs:ejson-file");
install("fortawesome:fontawesome");
install("andruschka:bootstrap-image-gallery");
install("cesarve:simple-chat", "meteor/cesarve:simple-chat/server.js");
install("themeteorchef:bert");
install("coffeescript");
install("webtempest:animate");
install("cfs:s3");
install("lbee:lunr");
install("tmeasday:paginated-subscription");
install("hot-code-push");
install("launch-screen");
install("spiderable");
install("autoupdate");
install("mdg:validation-error");

////////////////////////////////////////////////////////////////////////////////////////

},"process.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////
//                                                                                    //
// packages/modules/process.js                                                        //
//                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////
                                                                                      //
if (! global.process) {
  try {
    // The application can run `npm install process` to provide its own
    // process stub; otherwise this module will provide a partial stub.
    global.process = require("process");
  } catch (missing) {
    global.process = {};
  }
}

var proc = global.process;

if (Meteor.isServer) {
  // Make require("process") work on the server in all versions of Node.
  meteorInstall({
    node_modules: {
      "process.js": function (r, e, module) {
        module.exports = proc;
      }
    }
  });
} else {
  proc.platform = "browser";
  proc.nextTick = proc.nextTick || Meteor._setImmediate;
}

if (typeof proc.env !== "object") {
  proc.env = {};
}

var hasOwn = Object.prototype.hasOwnProperty;
for (var key in meteorEnv) {
  if (hasOwn.call(meteorEnv, key)) {
    proc.env[key] = meteorEnv[key];
  }
}

////////////////////////////////////////////////////////////////////////////////////////

},"reify.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////
//                                                                                    //
// packages/modules/reify.js                                                          //
//                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////
                                                                                      //
require("reify/lib/runtime").enable(
  module.constructor.prototype
);

////////////////////////////////////////////////////////////////////////////////////////

},"node_modules":{"reify":{"lib":{"runtime":{"index.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////
//                                                                                    //
// node_modules/meteor/modules/node_modules/reify/lib/runtime/index.js                //
//                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////
                                                                                      //
module.useNode();
////////////////////////////////////////////////////////////////////////////////////////

}}}}}}},"@babel":{"runtime":{"helpers":{"builtin":{"interopRequireDefault.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////
//                                                                                    //
// node_modules/@babel/runtime/helpers/builtin/interopRequireDefault.js               //
//                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////
                                                                                      //
module.useNode();
////////////////////////////////////////////////////////////////////////////////////////

},"objectSpread.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////
//                                                                                    //
// node_modules/@babel/runtime/helpers/builtin/objectSpread.js                        //
//                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////
                                                                                      //
module.useNode();
////////////////////////////////////////////////////////////////////////////////////////

}}},"package.json":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////
//                                                                                    //
// node_modules/@babel/runtime/package.json                                           //
//                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////
                                                                                      //
module.useNode();
////////////////////////////////////////////////////////////////////////////////////////

}}},"semantic-ui-react":{"package.json":function(require,exports){

////////////////////////////////////////////////////////////////////////////////////////
//                                                                                    //
// node_modules/semantic-ui-react/package.json                                        //
//                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////
                                                                                      //
exports.name = "semantic-ui-react";
exports.version = "2.1.5";
exports.main = "dist/commonjs/index.js";

////////////////////////////////////////////////////////////////////////////////////////

},"dist":{"commonjs":{"index.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////
//                                                                                    //
// node_modules/semantic-ui-react/dist/commonjs/index.js                              //
//                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////
                                                                                      //
module.useNode();
////////////////////////////////////////////////////////////////////////////////////////

}}}},"bcrypt":{"package.json":function(require,exports){

////////////////////////////////////////////////////////////////////////////////////////
//                                                                                    //
// node_modules/bcrypt/package.json                                                   //
//                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////
                                                                                      //
exports.name = "bcrypt";
exports.version = "1.0.3";
exports.main = "./bcrypt";

////////////////////////////////////////////////////////////////////////////////////////

},"bcrypt.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////
//                                                                                    //
// node_modules/bcrypt/bcrypt.js                                                      //
//                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////
                                                                                      //
module.useNode();
////////////////////////////////////////////////////////////////////////////////////////

}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
var exports = require("/node_modules/meteor/modules/server.js");

/* Exports */
Package._define("modules", exports, {
  meteorInstall: meteorInstall
});

})();
