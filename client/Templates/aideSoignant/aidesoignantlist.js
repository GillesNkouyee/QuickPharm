Template.aidesoignantlist.helpers({
    aidesoignantlist: function() {
      Session.set('searchValue', $("#searchValue").val());
      Meteor.subscribe("aideSoignants", Session.get('searchValue'));
      if (Session.get('searchValue')) {
        return AideSoignants.find({},{sort: [["score", "desc"]],limit: 12});
      } else {
        Session.get('searchValue', "");

      }
    },
    aidesoignantlistItem:function(){
      return AideSoignants.find({}).count();
    }
  });