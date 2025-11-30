
Template.searchresults.helpers({
    medoclist: function() {
      Session.set('searchValue', $("#searchValue").val());
      Meteor.subscribe("searchresults", Session.get('searchValue'));
      if (Session.get('searchValue')) {
        return Productdata.find({},{sort: [["score", "desc"]],limit: 12});
      } else {
        Session.get('searchValue', "");

      }
    },
    medoclistItem:function(){
      return Productdata.find({}).count();
    }
  });
