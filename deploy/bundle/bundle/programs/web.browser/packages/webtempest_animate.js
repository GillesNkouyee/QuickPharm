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

/* Package-scope variables */
var __coffeescriptShare;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// packages/webtempest_animate/packages/webtempest_animate.js                                             //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// packages/webtempest:animate/template.transition.js                                               //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
                                                                                                    // 1
Template.__checkName("transition");                                                                 // 2
Template["transition"] = new Template("Template.transition", (function() {                          // 3
  var view = this;                                                                                  // 4
  return Blaze.If(function() {                                                                      // 5
    return Spacebars.call(Spacebars.dot(view.lookup("."), "wrap"));                                 // 6
  }, function() {                                                                                   // 7
    return [ "\n    ", HTML.DIV({                                                                   // 8
      "class": "transition-wrapper"                                                                 // 9
    }, "\n      ", Blaze._InOuterTemplateScope(view, function() {                                   // 10
      return Spacebars.include(function() {                                                         // 11
        return Spacebars.call(view.templateContentBlock);                                           // 12
      });                                                                                           // 13
    }), "\n    "), "\n  " ];                                                                        // 14
  }, function() {                                                                                   // 15
    return [ "\n    ", Blaze._InOuterTemplateScope(view, function() {                               // 16
      return Spacebars.include(function() {                                                         // 17
        return Spacebars.call(view.templateContentBlock);                                           // 18
      });                                                                                           // 19
    }), "\n  " ];                                                                                   // 20
  });                                                                                               // 21
}));                                                                                                // 22
                                                                                                    // 23
//////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// packages/webtempest:animate/transitions.coffee.js                                                //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var ENDTRANSITION, Transitions;

ENDTRANSITION = 'transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd transitionEnd msTransitionEnd animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd animationEnd msAnimationEnd';

Transitions = (function() {
  function Transitions(options) {
    var defaults, self;
    defaults = {
      onScreenClass: '',
      offScreenClass: '',
      hiddenClass: 'out',
      animateClass: "animated"
    };
    this.opt = _.defaults(options, defaults);
    this.opt.insertTimeout = this.getInsertTimeout();
    this.opt.removeTimeout = this.getRemoveTimeout();
    this.opt.parentNode._uihooks = this.createHooks();
    self = this;
    this.setupStyles();
    _.each($(this.opt.parentNode).find('.animated.out'), function(item) {
      return self.insertElement(item, null);
    });
  }

  Transitions.prototype.setupStyles = function() {
    var randName, styleInjection;
    if (this.opt.inDuration || this.opt.outDuration) {
      randName = this.opt.onScreenClass + _.random(0, 1000);
      styleInjection = $("<style></style>");
      $(this.opt.parentNode).addClass(randName);
      if (this.opt.inDuration) {
        styleInjection.append("." + randName + " .animated." + this.opt.onScreenClass + " {-webkit-animation-duration: " + this.opt.inDuration + "ms;animation-duration: " + this.opt.inDuration + "ms;}");
      }
      if (this.opt.outDuration) {
        styleInjection.append("." + randName + " .animated." + this.opt.offScreenClass + " {-webkit-animation-duration: " + this.opt.outDuration + "ms;animation-duration: " + this.opt.outDuration + "ms;}");
      }
      return $(this.opt.parentNode).append(styleInjection);
    }
  };

  Transitions.prototype.getInsertTimeout = function() {
    if (this.opt.inDuration) {
      return parseInt(this.opt.inDuration);
    }
    switch (this.opt.onScreenClass) {
      case 'hinge':
        return 2000;
      case 'bounceIn':
        return 750;
      default:
        return 1000;
    }
  };

  Transitions.prototype.getRemoveTimeout = function() {
    if (this.opt.outDuration) {
      return parseInt(this.opt.outDuration);
    }
    switch (this.opt.offScreenClass) {
      case 'hinge':
        return 2000;
      case 'bounceOut':
        return 750;
      case 'flipOutX':
        return 750;
      case 'flipOutY':
        return 750;
      default:
        return 1000;
    }
  };

  Transitions.prototype.insertElement = function(node, next) {
    var $node, $parent, finish, insert, self;
    self = this;
    $node = $(node);
    $parent = $(self.opt.parentNode);
    $node.addClass("" + self.opt.animateClass + " " + self.opt.hiddenClass);
    $node.attr('hidden', true);
    $(next).before($node);
    finish = function(e) {
      $node.removeClass(self.opt.onScreenClass);
      return node.setAttribute('inserting', false);
    };
    insert = function() {
      $node.width();
      $node.attr('hidden', false);
      $node.removeClass(self.opt.hiddenClass);
      $node.addClass(self.opt.onScreenClass);
      return $node.one(ENDTRANSITION, finish);
    };
    if (self.removing) {
      return Meteor.setTimeout(insert, self.opt.removeTimeout);
    } else {
      return insert();
    }
  };

  Transitions.prototype.removeElement = function(node) {
    var $node, remove, self;
    $node = $(node);
    self = this;
    $node.addClass(self.opt.animateClass);
    remove = function(e) {
      self.removing = false;
      return $node.remove();
    };
    if (self.opt.offScreenClass) {
      $node.addClass(self.opt.offScreenClass);
      self.removing = true;
      return $node.one(ENDTRANSITION, remove);
    } else {
      return remove();
    }
  };

  Transitions.prototype.createHooks = function() {
    return {
      opt: this.opt,
      insertElement: this.insertElement,
      removeElement: this.removeElement
    };
  };

  return Transitions;

})();

Template.transition.onRendered(function() {
  var inDuration, outDuration, params, parentNode, transitionIn, transitionOut, transitions, _ref, _ref1, _ref10, _ref11, _ref12, _ref13, _ref14, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
  transitionIn = ((_ref = this.data) != null ? (_ref1 = _ref["in"]) != null ? (_ref2 = _ref1.match(/^(.*)\:/)) != null ? _ref2[1] : void 0 : void 0 : void 0) || ((_ref3 = this.data) != null ? _ref3["in"] : void 0);
  transitionOut = ((_ref4 = this.data) != null ? (_ref5 = _ref4.out) != null ? (_ref6 = _ref5.match(/^(.*)\:/)) != null ? _ref6[1] : void 0 : void 0 : void 0) || ((_ref7 = this.data) != null ? _ref7.out : void 0);
  inDuration = (_ref8 = this.data) != null ? (_ref9 = _ref8["in"]) != null ? (_ref10 = _ref9.match(/\:(\d*)/)) != null ? _ref10[1] : void 0 : void 0 : void 0;
  outDuration = (_ref11 = this.data) != null ? (_ref12 = _ref11.out) != null ? (_ref13 = _ref12.match(/\:(\d*)/)) != null ? _ref13[1] : void 0 : void 0 : void 0;
  if (this.$('>').first().hasClass('transition-wrapper')) {
    parentNode = this.$('>').first()[0];
  } else {
    parentNode = (_ref14 = this.firstNode) != null ? _ref14.parentNode : void 0;
  }
  params = {
    onScreenClass: transitionIn,
    offScreenClass: transitionOut,
    inDuration: inDuration,
    outDuration: outDuration,
    parentNode: parentNode
  };
  return transitions = new Transitions(params);
});

Template.transition.onDestroyed(function() {
  var _ref, _ref1;
  return (_ref = this.firstNode) != null ? (_ref1 = _ref.parentNode) != null ? _ref1._uihooks = null : void 0 : void 0;
});
//////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// packages/webtempest:animate/template.animate.js                                                  //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
                                                                                                    // 1
Template.__checkName("animate");                                                                    // 2
Template["animate"] = new Template("Template.animate", (function() {                                // 3
  var view = this;                                                                                  // 4
  return Blaze._InOuterTemplateScope(view, function() {                                             // 5
    return Spacebars.include(function() {                                                           // 6
      return Spacebars.call(view.templateContentBlock);                                             // 7
    });                                                                                             // 8
  });                                                                                               // 9
}));                                                                                                // 10
                                                                                                    // 11
//////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// packages/webtempest:animate/animate.coffee.js                                                    //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Template.animate.onRendered(function() {
  var $node, animate, animation, delay, self, _ref, _ref1;
  self = this;
  $node = this.$('>').first();
  animation = ((_ref = self.data) != null ? _ref.type : void 0) || 'bounce';
  delay = ((_ref1 = self.data) != null ? _ref1.delay : void 0) && parseInt(self.data.delay) || 200;
  animate = function() {
    return $node.addClass("animated " + animation);
  };
  if (delay) {
    return Meteor.setTimeout(animate, delay);
  } else {
    return animate();
  }
});
//////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);

////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
Package._define("webtempest:animate");

})();
