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
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;
var Template = Package['templating-runtime'].Template;
var HTML = Package.htmljs.HTML;
var Spacebars = Package.spacebars.Spacebars;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                            //
// packages/raix_ui-dropped-event/packages/raix_ui-dropped-event.js                           //
//                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                              //
(function () {

//////////////////////////////////////////////////////////////////////////////////////////
//                                                                                      //
// packages/raix:ui-dropped-event/dropped.event.js                                      //
//                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////
                                                                                        //
  // backwards compatibility                                                            // 1
  var ref;                                                                              // 2
  if (typeof Blaze !== "undefined" && typeof Blaze.View !== "undefined") {              // 3
    // Meteor 0.8.3+                                                                    // 4
    ref = Template.prototype;                                                           // 5
  } else {                                                                              // 6
    ref = UI.Component;                                                                 // 7
  }                                                                                     // 8
                                                                                        // 9
  // Save super before overwriting                                                      // 10
  var _super = ref.events;                                                              // 11
                                                                                        // 12
  // The noopHandler stops propagation and default                                      // 13
  var _noopHandler = function noopEventHandler(evt) {                                   // 14
    // var evt = (e.originalEvent || e);                                                // 15
    evt.stopPropagation();                                                              // 16
    evt.preventDefault();                                                               // 17
  }                                                                                     // 18
                                                                                        // 19
  // Overwrite name it for debugging                                                    // 20
  ref.events = function uiDroppedEvents_Overwrite(dict) {                               // 21
    var self = this;                                                                    // 22
                                                                                        // 23
    // Carry                                                                            // 24
    var resultDict = {};                                                                // 25
                                                                                        // 26
    // Iterate over the event bindings                                                  // 27
    for (var name in dict) {                                                            // 28
                                                                                        // 29
      // XXX: we dont currently support 'dropped #foo, dropped #bar'                    // 30
      if (/^dropped/.test(name)) {                                                      // 31
        // Get the selector part                                                        // 32
        var selector = name.split(' ')[1];                                              // 33
        var n = name;                                                                   // 34
                                                                                        // 35
        if (selector) {                                                                 // 36
                                                                                        // 37
          // Block drag events                                                          // 38
          resultDict['dragenter/dragexit/dragover/dragend ' + selector] = _noopHandler; // 39
                                                                                        // 40
          // Rig the drop event                                                         // 41
          resultDict['drop ' + selector] = function(evt, tmp) {                         // 42
            // Stop original behaviour                                                  // 43
            _noopHandler(evt);                                                          // 44
                                                                                        // 45
            // Run user callback                                                        // 46
            dict[n].apply(this, [evt, tmp]);                                            // 47
          };                                                                            // 48
        }                                                                               // 49
      } else {                                                                          // 50
        // Pass on original                                                             // 51
        resultDict[name] = dict[name];                                                  // 52
      }                                                                                 // 53
                                                                                        // 54
    }                                                                                   // 55
                                                                                        // 56
    // Hand over to super                                                               // 57
    return _super.apply(self, [resultDict]);                                            // 58
  };                                                                                    // 59
                                                                                        // 60
//////////////////////////////////////////////////////////////////////////////////////////

}).call(this);

////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
Package._define("raix:ui-dropped-event");

})();
