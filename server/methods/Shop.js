/**
 * Created by bangt on 04/07/2016.
 */


Meteor.methods({
    'createnewPharm': function(doc) {
      if (!this.userId) {
      return throwError(403, 'Must be logged in');
      }
        console.log("Adding", doc);
        check(doc, Schemas.shop);

        Shop.insert(doc, function(err, _id) {console.log("ShopID: ", docID);});//callback error function
    },
    updateShopData: function(doc, docID) {
      if (!this.userId) {
      return throwError(403, 'Must be logged in');
       }
        console.log("Updating", doc);
        check(doc, Shop.simpleSchema());
        Shop.update({_id: docID}, doc);
    },
    'deleteShop': function (shopId){
      //get current user
        var user = Meteor.user();
        if(!shopId){
          throw new Meteor.Error('This pharmacy Id can not be empty');
        }
        Shop.remove(shopId);
        toastr.warning('Another pharmacy deleted by'+user.profile.name );
    },
    upvote: function(shopId) {
    check(this.userId, String);
    check(shopId, String);
    var shop = Shop.findOne(shopId);
    if (!shop)
      throw new Meteor.Error('invalid', 'Shop not found');
    if (_.include(shop.upvoters, this.userId))
      throw new Meteor.Error('invalid', 'Already upvoted this shop');
    Shop.update(shop._id, {
      $addToSet: {upvoters: this.userId},
      $inc: {votes: 1}
    });
  }
});
