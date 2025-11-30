Meteor.methods({
    ajoutAidesoignant:function(nom,prenom,specialite,telephone,localisation,disponible,dernierAppel,addedBy,createdAt,updatedAt) {
        var user = Meteor.user();
        //var fileShopId = template.data._id;
        console.log("Adding", nom,prenom,specialite,telephone,localisation,disponible,dernierAppel,addedBy,createdAt,updatedAt);
        //check(doc, String);
        // Make sure the user is logged in before inserting a task
           if (! this.userId) {
             throw new Meteor.Error('not-authorized');
           }

           AideSoignants.insert({
              nom:nom,
              prenom:prenom,
              specialite:specialite,
              telephone:telephone,
              localisation:localisation,
              disponible:disponible,
              dernierAppel:dernierAppel,
              addedBy: user,
              createdAt:new Date(),

              updatedAt: null});
        // , function(err, docID) {console.log("AideSoignantId: ", docID,err);});//callback error function
      },
        'deleteAidesoignant': function (AideSoignantId){
          //get current user
            var user = Meteor.user();
            if(!AideSoignantId){
              throw new Meteor.Error('AideSoignant Id  can not be empty');
            }

            AideSoignants.remove(AideSoignantId);
            toastr.warning('Some product deleted by'+user.profile.name );
        }
});