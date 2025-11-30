Template.updateshop.onCreated( () => {
  Template.instance().subscribe( 'users' );
});
Template.updateshop.helpers({
   shopliste: function(){
    return Shop.find();
  },
  usercount:function(){
       var usercount = Meteor.users.find().count();
        if(usercount){
       return usercount;
     }
   },
    drugscounter: function(){
       return Productdata.find().count();
    },
    drugslistitem: function(){
       var druglst =  Productdata.find({},{sort:{createdAt:-1}});

       druglst.forEach(function(show){
         productid = show._id;
         console.log(productid);
       });
       return druglst;
    },
  	commentcounter: function(){
  		return Comments.find().count();
  	},
  	shopcounter: function(){
    	return Shop.find().count();
    },
    userlist: function(){
    	return Meteor.user();
    }

});
Template.updateshop.events({
	"click #export": function() {
		shopExporter.exportAllShops();
	},
  "click .fa-trash":function(){
    console.log(this);
  },
  'submit #adpic':function(event,template){
    event.preventDefault();
    var productid = this._id;
    var fileShopId = this.fileShopId;
    var images = event.target.images.files;
    var user = Meteor.user();

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
       //pic.price = price;
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
           console.log("The picture type is " + pic.type());

           console.log("The picture " + pic.name());

           Articles.insert(pic, function(err, fileObj) {
             let id = fileObj._id;
             // console.log("waiting for image with id = " + id);
                 let cursor = Articles.find({_id: id});
                console.log("image obj");

                 let image = Articles.findOne({_id: id});
                console.log("Image");
                console.log(JSON.stringify(image));
                let liveQuery = cursor.observe({
                    changed (newArticles, oldArticles){
                        if (newArticles.url() !== null) {
                            liveQuery.stop();

                            console.log('Upload finished for ' + fileObj.name());
                            let imagePath = '/uploads/images-' + fileObj._id + '-' + fileObj.name();
                            let entry = {id: fileObj._id, name: fileObj.name(), path: imagePath};
                            uploadedImageFiles.push(entry);
                        }
                    }
                });
             // var inp = document.getElementById('images');
             //   for (var i = 0; i < inp.files.length; ++i) {
             //     return i;
             //   }
             // if(err) {
             //   //console.log(err);
             //   toastr.warning(err);
             //   //Router.go('gestionShop');
             // } else {
             //
             //   console.log("Imageupload successful");
             //   toastr.success('Upload succeeded!' + 'new article added by :'+'  '+user.profile.name);
             //    console.log(productid);
             //    console.log(fileObj);
             //    console.log(inp.files.length);
             //
             //      //Traitement des images [exemple : ]
             //   }
           });
       }
  }
});
Template.EditShop.helpers({

  data: function () {
  return Shop.findOne({_id: this.params._id});
  },
  edit: function() {
  this.render('EditShop', {});
},
shopdrugslist: function(){
   var shopdruglst =  Productdata.find({fileShopId:this._id},{sort: {uploadedAt:-1}});

   shopdruglst.forEach(function(show){
     productid = show._id;
     console.log(productid);
   });
   return shopdruglst;
},
onError: function(){
  return function(error){bert.alert("BOO!");console.log(error);}
},
onSucces: function(){
return function(result){bert.alert("YAY!");console.log(result);}
},
beforRemove: function(){
  return function(Shop, id){
    var doc = Shop.findOne(id);
    //if ( confirm( "Are you sure? This is permanent." ) ) {
    if (confirm('Really delete"' + doc.shopname+'"?')){
      this.remove();
    }
  };
},
show: function(){
    return Template.instance().show.get();
  },
  text: function(){
    return "Are you sure?";
  },
  action: function(){
    return "delete pharmacy";
  }
});
Template.EditShop.created = function(){
  this.show = new ReactiveVar(false);
};
Template.EditShop.events({
  'submit #addpic':function(event,template){
    event.preventDefault();
    var productid = this._id;
    var fileShopId = this.fileShopId;
    var images = event.target.images.files;
    var user = Meteor.user();

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
       //pic.price = price;
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
           console.log("The picture type is " + pic.type());

           console.log("The picture " + pic.name());

           Articles.insert(pic, function(err, fileObj) {
             var inp = document.getElementById('images');
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
  },
  "click button.delete": function(event, template){
    if (Session.get("confirming")){
      console.log("You are already confirming another deletion.");
      return;
    }
    Session.set("confirming", true);
    template.show.set(true);
  },
  "click button.confirm": function(event, template){
    Meteor.call(
      "deleteShop",
      this._id,
      function(error, result){
        template.show.set(false);
        Session.set("confirming", false);
      }
    )
  }

});

Template.updateshop.onRendered(function(){
  $('.menu .item')
  .tab()
;

	 $('.filterable .btn-filter').click(function(){
        var $panel = $(this).parents('.filterable'),
        $filters = $panel.find('.filters input'),
        $tbody = $panel.find('.table tbody');
        if ($filters.prop('disabled') == true) {
            $filters.prop('disabled', false);
            $filters.first().focus();
        } else {
            $filters.val('').prop('disabled', true);
            $tbody.find('.no-result').remove();
            $tbody.find('tr').show();
        }
    });

    $('.filterable .filters input').keyup(function(e){
        /* Ignore tab key */
        var code = e.keyCode || e.which;
        if (code == '9') return;
        /* Useful DOM data and selectors */
        var $input = $(this),
        inputContent = $input.val().toLowerCase(),
        $panel = $input.parents('.filterable'),
        column = $panel.find('.filters th').index($input.parents('th')),
        $table = $panel.find('.table'),
        $rows = $table.find('tbody tr');
        /* Dirtiest filter function ever ;) */
        var $filteredRows = $rows.filter(function(){
            var value = $(this).find('td').eq(column).text().toLowerCase();
            return value.indexOf(inputContent) === -1;
        });
        /* Clean previous no-result if exist */
        $table.find('tbody .no-result').remove();
        /* Show all rows, hide filtered ones (never do that outside of a demo ! xD) */
        $rows.show();
        $filteredRows.hide();
        /* Prepend no-result row if all rows are filtered */
        if ($filteredRows.length === $rows.length) {
            $table.find('tbody').prepend($('<tr class="no-result text-center"><td colspan="'+ $table.find('.filters th').length +'">No result found</td></tr>'));
        }
    });

});
