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
var Template = Package['templating-runtime'].Template;
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;
var Spacebars = Package.spacebars.Spacebars;
var HTML = Package.htmljs.HTML;

(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/jss_spinner/lib/template.spinner.js                                                              //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //

Template.__checkName("Spinner");
Template["Spinner"] = new Template("Template.Spinner", (function() {
  var view = this;
  return HTML.Raw('<img src="/packages/jss_spinner/lib/spinner.gif" alt="Loading..." class="jss-spinner">');
}));

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
Package._define("jss:spinner");

})();
