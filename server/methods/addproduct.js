
Meteor.methods({
    ajoutproduit:function(brand,tag,price,desc,category,onpresc,fileShopId,images,addedBy,createdAt,updatedAt) {
        var user = Meteor.user();
        //var fileShopId = template.data._id;
        console.log("Adding", brand,tag,price,desc,category,onpresc,images,fileShopId,addedBy,createdAt,updatedAt);
        //check(doc, String);
        // Make sure the user is logged in before inserting a task
           if (! this.userId) {
             throw new Meteor.Error('not-authorized');
           }

            Productdata.insert({brand:brand,tag:tag,desc:desc,category:category,onpresc:onpresc,price:price,fileShopId:fileShopId,
              images:images,
              addedBy: user,
              createdAt:new Date(),

              updatedAt: null});
        // , function(err, docID) {console.log("productID: ", docID,err);});//callback error function
      },
        'deleteProductdata': function (productid){
          //get current user
            var user = Meteor.user();
            if(!productid){
              throw new Meteor.Error('Productdata Id can not be empty');
            }

            Productdata.remove(productdataId);
            toastr.warning('Some product deleted by'+user.profile.name );
        }
});

