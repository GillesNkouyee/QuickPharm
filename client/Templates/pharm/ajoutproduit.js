
Template.ajoutproduit.events({
  'submit #productform': function(event,template){
		event.preventDefault();
    var userId = Meteor.userId();
    var user = Meteor.user();
    var brand = event.target.brand.value;
    var desc = event.target.desc.value;
    var tag = event.target.tag.value;
    var price = event.target.price.value;
    var canal = event.target.canal.value;
    var category = event.target.category.value;
    var onpresc = event.target.onpresc.value;
    var lab = event.target.lab.value;
    var images = event.target.images.files;
    var freemodel = event.target.freeModel.checked;
    var fileShopId = template.data._id;
    var addedBy = userId;
    var createdAt= new Date();
    var numFiles = $("input:file")[0].files.length;

    if(user._id != this.createdBy){
       toastr.error("This Pharmacy is not yours!");
       throw new Meteor.Error('This Shopstore is not yours! ');
     }
    //console.log(freemodel);
    if(!freemodel) {
      var price = event.target.price.value;
    } else {
      var price = 0;
    }

    doc={brand:brand,tag:tag,desc:desc,canal:canal,category:category,onpresc:onpresc,lab:lab,
        price:price,fileShopId:fileShopId,
        addedBy:userId,
        createdAt:createdAt,
        updatedAt: createdAt};

    console.log("We are trying to process the upload " + numFiles+ 'files');

    Productdata.insert(doc, function(err, id) {
             if(err) {
               console.log(err);
               //Router.go('upload');
             } else {
               productid = id;
               console.log(productid);
               for(var i = 0, ln = images.length; i < ln;i++) {

                 var pic = new FS.File(images[i]);
                 if(images[0]) {
                    var mainImage = true;
                  } else {
                    var mainImage = false;
                  }
                  pic.fileShopId = fileShopId;
                  pic.addedBy = user;
                  pic.productid = productid;
                  pic.price = price;
                  pic.main = mainImage;

                  // Get file type
                  var _name = pic.name();
                  var _posOfType = _name.indexOf(".");
                  //console.log("Position of filetype " + _posOfType);
                  if(_posOfType) {
                              var _type = _name.substr(_posOfType);
                              } else {
                                var _type = "unknown";
                           }
                      pic.type(_type);
                      console.log(pic.url +" type is " + pic.type());

                      console.log("The picture " + pic.name());
                      var base64 = "";
                      var bytes = new Uint8Array( pic.url );
                      var len = bytes.byteLength;
                      for (var i = 0; i < len; i++) {
                          base64 += String.fromCharCode( bytes[i] );
                      var proPic = "data:image/png;base64," + base64;
                         console.log(proPic);
                         console.log(bytes);
                      }
                      Articles.insert(pic, function(err, fileObj) {
                        let inp = document.getElementById('images');
                          for (var i = 0; i < inp.files.length; ++i) {
                            return i;
                          }
                        if(err) {
                          //console.log(err);
                          toastr.warning(err);
                          //Router.go('gestionShop');
                        } else {

                          console.log("Imageupload successful");
                          toastr.success('Upload succeeded!' + 'new article added by :'+'  '+user.profile.name);
                           console.log(productid);
                           console.log(fileObj);
                           console.log(inp.files.length);

                             //Traitement des images [exemple : ]
                          }
                      });
                  }
              }
          });
          Router.go('shopinfo');
      return false;
      }
});

AutoForm.addHooks(
  ["productform"],
  {
    before   : {
      method: CfsAutoForm.Hooks.beforeInsert
    },
    after    : {
      method: CfsAutoForm.Hooks.afterInsert
    }
  }
);





// Template.postList.events({
//   // handle the form submission
//   'submit #form': function(event, template) {
//
//   // stop the form from submitting
//   event.preventDefault();
//
//   // get the data we need from the form
//   var file = template.find('.myFileInput').files[0];
//
// Meteor.call('ajoutpost',{
//     calendarId: this._id,
//     owner: Meteor.userId()
//   }, function(err, _id) {
//     var image = new FS.File(file);
//
//     file.postId = _id;
//
//     if (!err) {
//       Articles.insert(image);
//     }
//   });
//   }
// });
