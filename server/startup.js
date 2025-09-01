
  Meteor.startup(function () {
    Productdata._ensureIndex({
      "brand": "text"
    });
    // seed();
    // if (!document.cookie.match("searchresults="))
    //   $('body').append(Meteor.ui.render(Template.searchresults));   
  });
