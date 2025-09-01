var throwError = function(error, reason, details) {
  error = new Meteor.Error(error, reason, details);
  if (Meteor.isClient) {
    return error;
  } else if (Meteor.isServer) {
    throw error;
  }
};
/*Gestion des utilisateurs */
          Template.registerHelper( 'isCurrentUser', ( currentUser ) => {
            return currentUser === Meteor.userId() ? true : false;
          });
          
          Template.registerHelper( 'disableIfAdmin', ( userId ) => {
            if ( Meteor.userId() === userId ) {
              return Roles.userIsInRole( userId, 'admin' ) ? "disabled" : "";
           
               }
          });
          Template.registerHelper( 'disableIfbasic', ( userId ) => {
            if ( Meteor.userId() === userId ) {
              return Roles.userIsInRole( userId, 'basic' ) ? "disabled" : "";
            }
          });
        //   Template.registerHelper('Set_user_inactive',(userId) => {
        //     if ( Meteor.userId() === userId){
        //       return Roles.userIsInRole( userId,'inactive') ?"disabled" :"";
        //    }
        // });
          Template.registerHelper( 'selected', ( v1, v2 ) => {
            return v1 === v2 ? true : false;
          });
          Template.registerHelper('humanReadableDate', (date) =>{
              var m = moment(date);
              //return m.format("MMM,DD");
               return m.format("MMM,DD YYYY");
          });
		  Template.registerHelper('goodDateformat',(date) =>{

					  // var year = date.getYear();
					  // var month = (1 + date.getMonth()).toString();
					  // month = month.length > 1 ? month : '0' + month;
					  // var day = date.getDate().toString();
					  // day = day.length > 1 ? day : '0' + day;
					  // return month + '/' + day + '/' + year;

            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [year, month, day].join('-');


		  });

Template.registerHelper( 'selected', ( v1, v2 ) => {
  return v1 === v2 ? true : false;
});
Template.registerHelper('pluralize', function(n, thing) {
  // pluraliser assez simpliste
  if (n === 1) {
    return '1 ' + thing;
  } else {
    return n + ' ' + thing + 's';
  }

});
Template.registerHelper('ratings',function(comp,val){
    return val >= comp ? 'price-text-color':'';
});

Template.registerHelper('currency',function(value){
    return ''+'FCFA'+''+ ''+ Number(value).toFixed(2);
});

Template.registerHelper('truncate',function(inputtxt,strlen){
    var shortened;
    var strlen = 50;
    if(inputtxt.length > strlen){
        shortened = inputtxt.substring(15,strlen) + '...';
    }else {
        shortened = inputtxt;
    }
    return new Spacebars.SafeString(shortened);
});

if(Meteor.isClient){
//this function puts our cursor where it needs to be.
    function focusText(i) {
    i.focus();
    i.select();
	};
 } //------closing bracket for if(Meteor.isClient){}
   Template.registerHelper('affichage', function(myId,res) {
     // pluraliser assez simpliste
     if (myId) {
      var myurl = Articles.findOne(myId).original.name;
      return  myurl;
     } else {
       console.log('problem here');
     }

   });
   Template.registerHelper('showbrand', function(productid) {
     // pluraliser assez simpliste
     if (productid) {
      var Brand = Productdata.findOne(productid).brand;
      return  Brand;
       } else {
       Meteor.console.error();
       console.log('problem here');
     }

   });
   Template.registerHelper('showlab', function(productid) {
     // pluraliser assez simpliste
     if (productid) {
      var Labo = Productdata.findOne(productid).lab;
      return  Labo;
       } else {
       Meteor.console.error();
       console.log('problem here');
     }

   });
   Template.registerHelper('showcanal', function(productid) {
     // pluraliser assez simpliste
     if (productid) {
      var Canal = Productdata.findOne(productid).canal;
      return  Canal;
       } else {
       Meteor.console.error();
       console.log('problem here');
     }

   });
   Template.registerHelper('showdata', function(productid) {
     // pluraliser assez simpliste
     if (productid) {
      var Price = Productdata.findOne(productid).price;
      return  Price;
       } else {
       Meteor.console.error();
       console.log('problem here');
     }

   });
   Template.registerHelper('showdesc', function(productid) {
     // pluraliser assez simpliste
     if (productid) {
      var Desc = Productdata.findOne(productid).desc;
      return  Desc;
     } else {
       Meteor.console.error();
       console.log('problem here');
     }

   });
   Template.registerHelper('showtag', function(productid) {
     // pluraliser assez simpliste
     if (productid) {
      var tag = Productdata.findOne(productid).tag;
      return  tag;
     } else {
       Meteor.console.error();
       console.log('problem here');
     }

   });
   Template.registerHelper('showlocation', function(fileShopId) {
     // pluraliser assez simpliste
     if (fileShopId) {
      var location = Shop.findOne(fileShopId).shopadress;
      return  location;
     } else {
       Meteor.console.error();
       console.log('problem here');
     }

   });
   Template.registerHelper('showPharmName', function(fileShopId) {
     // pluraliser assez simpliste
     if (fileShopId) {
      var pharmName = Shop.findOne(fileShopId).shopname;
      return  pharmName;
     } else {
       Meteor.console.error();
       console.log('problem here');
     }

   });
   Template.registerHelper('showPharmTel', function(fileShopId) {
     // pluraliser assez simpliste
     if (fileShopId) {
      var pharmTel = Shop.findOne(fileShopId).shoptel;
      return  pharmTel;
     } else {
       Meteor.console.error();
       console.log('problem here');
     }

   });
   Template.registerHelper("currentFieldValue", function (fieldName) {
      return AutoForm.getFieldValue("reactiveCurrentValueForm", fieldName) || "not selected";
    });
    Template.registerHelper("guardClass",function(guardstatus){
      if (guardstatus == "non"){
        return "label label-large label-important   hidden";
      } else {
        return "label label-large label-important ";
      }
    });
////googlemaps test
Template.registerHelper("googleMapsReady", function() {
 return GoogleMaps.loaded();
});
Template.registerHelper("isFirst", function (index) {
  return index === 0;
});