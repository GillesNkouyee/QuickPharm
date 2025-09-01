
Meteor.methods({
  addStuff: function(doc) {
    if (!this.userId) {
      return throwError(403, 'Must be logged in');
    }
    console.log("Adding", doc);
    check(doc, Schemas.articledata);

  Articles.insert(doc, function(err, docID) {console.log("stuffId: ", docID);});//callback error function

},
  'deleteArticledata': function (articledataId){
    //get current user
      var user = Meteor.user();
      if(!articledataId){
        throw new Meteor.Error('Articles Id can not be empty');
      }

      Articles.remove(articledataId);
      alert('comment deleted by'+user.profile.name );
  }
});
