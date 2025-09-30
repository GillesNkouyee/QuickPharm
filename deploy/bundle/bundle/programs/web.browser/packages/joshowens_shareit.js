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
var _ = Package.underscore._;
var $ = Package.jquery.$;
var jQuery = Package.jquery.jQuery;
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;
var Spacebars = Package.spacebars.Spacebars;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var ShareIt, appId;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/joshowens_shareit/shareit.js                                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

ShareIt = {
  settings: {
    autoInit: true,
    buttons: 'responsive',
    sites: {
      'facebook': {
        'appId': null,
        'version': 'v2.1',
        'description': ''
      },
      'twitter': {
        'description': ''
      },
      'googleplus': {
        'description': ''
      },
      'pinterest': {
        'description': ''
      },
      'instagram': {
        'description': ''
      }
    },
    siteOrder: ['facebook', 'twitter', 'pinterest', 'googleplus', 'instagram'],
    classes: "large btn",
    iconOnly: false,
    faSize: '',
    faClass: '',
    applyColors: true
  },
  configure: function(hash) {
    return this.settings = $.extend(true, this.settings, hash);
  },
  helpers: {
    classes: function() {
      return ShareIt.settings.classes;
    },
    showText: function() {
      return !ShareIt.settings.iconOnly;
    },
    applyColors: function() {
      return ShareIt.settings.applyColors;
    },
    faSize: function() {
      return ShareIt.settings.faSize;
    },
    faClass: function() {
      if (!!ShareIt.settings.faClass) {
        return '-' + ShareIt.settings.faClass;
      } else {
        return '';
      }
    }
  }
};

ShareIt.init = function(hash) {
  this.settings = $.extend(true, this.settings, hash);
  window.twttr = (function(d, s, id) {
    var fjs, js, t;
    t = void 0;
    js = void 0;
    fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
      return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "https://platform.twitter.com/widgets.js";
    fjs.parentNode.insertBefore(js, fjs);
    return window.twttr || (t = {
      _e: [],
      ready: function(f) {
        return t._e.push(f);
      }
    });
  })(document, 'script', 'twitter-wjs');
  $('<div id="fb-root"></div>').appendTo('body');
  if (ShareIt.settings.autoInit) {
    window.fbAsyncInit = function() {
      return FB.init({appId: ShareIt.settings.sites.facebook.appId, version: 'v2.4'});
    };
  }
  return (function(d, s, id) {
    var fjs, js;
    js = void 0;
    fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
      return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = '//connect.facebook.net/en_US/sdk.js';
    fjs.parentNode.insertBefore(js, fjs);
  })(document, 'script', 'facebook-jssdk');
};

ShareIt.facebookMeta = function(description, url, title, img) {
  $('meta[property^="og:"]').remove();
  $('<meta>', {
    property: 'og:type',
    content: 'article'
  }).appendTo('head');
  $('<meta>', {
    property: 'og:site_name',
    content: location.hostname
  }).appendTo('head');
  $('<meta>', {
    property: 'og:url',
    content: url
  }).appendTo('head');
  $('<meta>', {
    property: 'og:title',
    content: title
  }).appendTo('head');
  $('<meta>', {
    property: 'og:description',
    content: description
  }).appendTo('head');
  $('<meta>', {
    property: 'og:image',
    content: img
  }).appendTo('head');
};

ShareIt.twitterMeta=function(author,title,description,img){
  $('meta[property^="twitter:"]').remove();
  $('<meta>', {
    property: 'twitter:card',
    content: 'summary'
  }).appendTo('head');
  if (author) {
    $('<meta>', {
      property: 'twitter:creator',
      content: author
    }).appendTo('head');
  }

  $('<meta>', {
    property: 'twitter:url',
    content: location.origin + location.pathname
  }).appendTo('head');
  $('<meta>', {
    property: 'twitter:title',
    content: "" + title
  }).appendTo('head');

  $('<meta>', {
    property: 'twitter:description',
    content: description
  }).appendTo('head');
  $('<meta>', {
    property: 'twitter:image',
    content: img
  }).appendTo('head');
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/joshowens_shareit/client/views/template.social.js                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("shareit");
Template["shareit"] = new Template("Template.shareit", (function() {
  var view = this;
  return HTML.DIV({
    class: "share-buttons"
  }, "\n  ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("siteTemplates"));
  }, function() {
    return [ "\n    ", Blaze._TemplateWith(function() {
      return {
        template: Spacebars.call(view.lookup(".")),
        data: Spacebars.call(view.lookup(".."))
      };
    }, function() {
      return Spacebars.include(function() {
        return Spacebars.call(Template.__dynamic);
      });
    }), "\n  " ];
  }), "\n");
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/joshowens_shareit/client/views/social.js                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Template.shareit.helpers({
  siteTemplates: function() {
    var i, len, ref, site, templates;
    templates = [];
    ref = ShareIt.settings.siteOrder;
    for (i = 0, len = ref.length; i < len; i++) {
      site = ref[i];
      if (ShareIt.settings.sites[site] != null) {
        templates.push('shareit_' + site);
      }
    }
    return templates;
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/joshowens_shareit/client/views/facebook/template.facebook.js                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("shareit_facebook");
Template["shareit_facebook"] = new Template("Template.shareit_facebook", (function() {
  var view = this;
  return HTML.A({
    target: "_blank",
    class: function() {
      return [ Spacebars.mustache(view.lookup("classes")), Blaze.If(function() {
        return Spacebars.call(view.lookup("applyColors"));
      }, function() {
        return " shareit-facebook-colors";
      }), " fb-share" ];
    },
    href: "#"
  }, "\n    ", HTML.I({
    class: function() {
      return [ "fa fa-facebook", Spacebars.mustache(view.lookup("faClass")), " ", Spacebars.mustache(view.lookup("faSize")) ];
    }
  }), "\n    ", Blaze.If(function() {
    return Spacebars.call(view.lookup("showText"));
  }, function() {
    return " Share on Facebook";
  }), "\n  ");
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/joshowens_shareit/client/views/facebook/facebook.js                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Template.shareit_facebook.onRendered(function() {
  if (!this.data) {
    return;
  }
  this.autorun(function() {
    var base, data, description, href, ref, summary, img, template, title, url;
    template = Template.instance();
    data = Template.currentData();
    description = ((ref = data.facebook) != null ? ref.description : void 0) || data.excerpt || data.description || data.summary;
    url = data.url || location.origin + location.pathname;
    title = data.title;
    if (data.thumbnail) {
      if (typeof data.thumbnail === "function") {
        img = data.thumbnail();
      } else {
        img = data.thumbnail;
      }
    }
    if (data.image) {
      if (typeof data.image === "function") {
        img = data.image();
      } else {
        img = data.image;
      }
    }
    if (img) {
      if (!/^http(s?):\/\/+/.test(img)) {
        img = location.origin + img;
      }
    }
    ShareIt.facebookMeta(description, url, title, img);
    appId = ShareIt.settings.sites.facebook.appId;
    if (ShareIt.settings.sites.facebook.popup != null) {
      return template.$('.fb-share').click(function(e) {
        e.preventDefault();
        return FB.ui({
          method: 'feed',
          display: 'popup',
          app_id: appId,
          link: url,
          name: title,
          description: summary,
          picture: img,
          redirect_uri: url
        }, function(response) {});
      });
    } else {
      url = encodeURIComponent(url);
      base = "https://www.facebook.com/dialog/feed";
      title = encodeURIComponent(title);
      summary = encodeURIComponent(description);
      href = base + "?app_id=" + appId + "&link=" + url + "&name=" + title + "&description=" + summary + "&redirect_uri=" + url;
      if (img)
        href = href + "&picture=" + img;
      return template.$(".fb-share").attr("href", href);
    }
  });
});

Template.shareit_facebook.helpers(ShareIt.helpers);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/joshowens_shareit/client/views/twitter/template.twitter.js                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("shareit_twitter");
Template["shareit_twitter"] = new Template("Template.shareit_twitter", (function() {
  var view = this;
  return HTML.A({
    class: function() {
      return [ Spacebars.mustache(view.lookup("classes")), Blaze.If(function() {
        return Spacebars.call(view.lookup("applyColors"));
      }, function() {
        return " shareit-twitter-colors";
      }), " tw-share" ];
    },
    href: function() {
      return [ "https://twitter.com/intent/tweet?url=", Spacebars.mustache(view.lookup("url")), "&text=", Spacebars.mustache(view.lookup("text")) ];
    }
  }, "\n    ", HTML.I({
    class: function() {
      return [ "fa fa-twitter", Spacebars.mustache(view.lookup("faClass")), " ", Spacebars.mustache(view.lookup("faSize")) ];
    }
  }), Blaze.If(function() {
    return Spacebars.call(view.lookup("showText"));
  }, function() {
    return " Share on Twitter";
  }), "\n  ");
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/joshowens_shareit/client/views/twitter/twitter.js                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Template.shareit_twitter.rendered = function() {
  if (!this.data) {
    return;
  }
  return this.autorun(function() {
    var base, data, description, href, img, preferred_url, ref, ref1, template, text, url;
    template = Template.instance();
    data = Template.currentData();
    if (data.thumbnail) {
      if (typeof data.thumbnail === "function") {
        img = data.thumbnail();
      } else {
        img = data.thumbnail;
      }
      if (img) {
        if (!/^http(s?):\/\/+/.test(img)) {
          img = location.origin + img;
        }
      }
    }
    description = ((ref = data.twitter) != null ? ref.description : void 0) || data.excerpt || data.description || data.summary;
    ShareIt.twitterMeta(data.author,data.title,description,img);
    preferred_url = data.url || location.origin + location.pathname;
    url = encodeURIComponent(preferred_url);
    base = "https://twitter.com/intent/tweet";
    text = encodeURIComponent(((ref1 = data.twitter) != null ? ref1.title : void 0) || data.title);
    href = base + "?url=" + url + "&text=" + text;
    if (data.author) {
      href += "&via=" + data.author;
    }
    return template.$(".tw-share").attr("href", href);
  });
};

Template.shareit_twitter.helpers(ShareIt.helpers);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/joshowens_shareit/client/views/googleplus/template.googleplus.js                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("shareit_googleplus");
Template["shareit_googleplus"] = new Template("Template.shareit_googleplus", (function() {
  var view = this;
  return HTML.A({
    class: function() {
      return [ Spacebars.mustache(view.lookup("classes")), Blaze.If(function() {
        return Spacebars.call(view.lookup("applyColors"));
      }, function() {
        return " shareit-google-colors";
      }), " googleplus-share" ];
    },
    href: "https://plus.google.com/share?url=#{url}",
    onclick: "javascript:window.open(this.href,'', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');return false;"
  }, "\n    ", HTML.I({
    class: function() {
      return [ "fa fa-google-plus", Spacebars.mustache(view.lookup("faClass")), " ", Spacebars.mustache(view.lookup("faSize")) ];
    }
  }), Blaze.If(function() {
    return Spacebars.call(view.lookup("showText"));
  }, function() {
    return " Share on Google+";
  }), "\n");
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/joshowens_shareit/client/views/googleplus/googleplus.js                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Template.shareit_googleplus.rendered = function() {
  if (!this.data) {
    return;
  }
  return this.autorun(function() {
    var data, description, href, img, itemtype, ref, ref1, template, title, url;
    template = Template.instance();
    data = Template.currentData();
    $('meta[itemscope]').remove();
    description = ((ref = data.googleplus) != null ? ref.description : void 0) || data.excerpt || data.description || data.summary;
    url = data.url || location.origin + location.pathname;
    title = data.title;
    itemtype = ((ref1 = data.googleplus) != null ? ref1.itemtype : void 0) || 'Article';
    $('html').attr('itemscope', '').attr('itemtype', "http://schema.org/" + itemtype);
    $('<meta>', {
      itemprop: 'name',
      content: location.hostname
    }).appendTo('head');
    $('<meta>', {
      itemprop: 'url',
      content: url
    }).appendTo('head');
    $('<meta>', {
      itemprop: 'description',
      content: description
    }).appendTo('head');
    if (data.thumbnail) {
      if (typeof data.thumbnail === "function") {
        img = data.thumbnail();
      } else {
        img = data.thumbnail;
      }
    }
    if (img) {
      if (!/^http(s?):\/\/+/.test(img)) {
        img = location.origin + img;
      }
    }
    $('<meta>', {
      itemprop: 'image',
      content: img
    }).appendTo('head');
    href = "https://plus.google.com/share?url=" + url;
    return template.$(".googleplus-share").attr("href", href);
  });
};

Template.shareit_googleplus.helpers(ShareIt.helpers);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/joshowens_shareit/client/views/pinterest/template.pinterest.js                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("shareit_pinterest");
Template["shareit_pinterest"] = new Template("Template.shareit_pinterest", (function() {
  var view = this;
  return HTML.A({
    class: function() {
      return [ Spacebars.mustache(view.lookup("classes")), Blaze.If(function() {
        return Spacebars.call(view.lookup("applyColors"));
      }, function() {
        return " shareit-pinterest-colors";
      }), " pinterest-share" ];
    },
    href: function() {
      return [ "https://www.pinterest.com/pin/create/button/?url=", Spacebars.mustache(view.lookup("url")), "&media=", Spacebars.mustache(view.lookup("media")), "&description=", Spacebars.mustache(view.lookup("description")) ];
    }
  }, "\n    ", HTML.I({
    class: function() {
      return [ "fa fa-pinterest", Spacebars.mustache(view.lookup("faClass")), " ", Spacebars.mustache(view.lookup("faSize")) ];
    }
  }), Blaze.If(function() {
    return Spacebars.call(view.lookup("showText"));
  }, function() {
    return " Share on Pinterest";
  }), "\n  ");
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/joshowens_shareit/client/views/pinterest/pinterest.js                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Template.shareit_pinterest.rendered = function() {
  if (!this.data) {
    return;
  }
  return this.autorun(function() {
    var data, description, href, preferred_url, ref, template, url;
    template = Template.instance();
    data = Template.currentData();
    preferred_url = data.url || location.origin + location.pathname;
    url = encodeURIComponent(preferred_url);
    description = encodeURIComponent(((ref = data.pinterest) != null ? ref.description : void 0) || data.description);
    href = "http://www.pinterest.com/pin/create/button/?url=" + url + "&media=" + data.media + "&description=" + description;
    return template.$('.pinterest-share').attr('href', href);
  });
};

Template.shareit_pinterest.events({
  'click a': function(event, template) {
    event.preventDefault();
    return window.open($(template.find('.pinterest-share')).attr('href'), 'pinterest_window', 'width=750, height=650');
  }
});

Template.shareit_pinterest.helpers(ShareIt.helpers);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
Package._define("joshowens:shareit", {
  ShareIt: ShareIt
});

})();
