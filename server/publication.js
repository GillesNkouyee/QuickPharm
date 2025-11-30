import { UserHistory } from '/collections/userHistory.js';
import { Visits } from '/collections/visits.js';


Meteor.startup(() => {
  Shop._ensureIndex({"location": "2dsphere"});
});

Meteor.publish("navbar",function (){
       Meteor.users.findOne({ _id: Meteor.userId });
});

Meteor.publish("shoplist",function(sort,limit){
   return Shop.find({}, {sort: sort, limit: limit});
});
// server/publications.js
Meteor.publish('paginatedShops', function (page, limit) {
  check(page, Number);
  check(limit, Number);

  const skip = (page - 1) * limit;
  return Shop.find({}, { skip, limit });
});

Meteor.publish('paginatedDrugs', function (page, limit) {
  check(page, Number);
  check(limit, Number);

  const skip = (page - 1) * limit;
  return Productdata.find({}, { skip, limit });
});

Meteor.publish('paginatedAssistant', function (page, limit) {
  check(page, Number);
  check(limit, Number);

  const skip = (page - 1) * limit;
  return AideSoignants.find({}, { skip, limit });
});

Meteor.publish("shop",function(search,sort, limit){
  return Shop.find(search, {sort: sort, limit: limit});
});

Meteor.publish("shopSearch", function(searchData) {
  if (!searchData) {
    return [];
  }

  var radius = searchData.radius;
  var centerLat = searchData.location.lat;
  var centerLon = searchData.location.lng;

  var selector = {
    "location.geometry": {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [centerLon, centerLat]
        },
        $maxDistance: radius * 1000,
        $minDistance: 0
      }
    }
  };

  return Shop.find(selector);
});
Meteor.publish("open",function(){
return Cards_open.find();
});
Meteor.publish("updateshop",function(){
return Shop.find();
});
Meteor.publish("comments",function(){
return Comments.find();
});
/*Meteor.startup(function(){*/
  Meteor.publish("showarticle",function(shopId/*,skipCount*/){
  return Articles.find({ShopId: shopId}/*,{limit:10,skip:skipCount}*/)
});
Meteor.publish("articlestore",function(shopId/*,skipCount*/){
return Articles.find({ShopId: shopId}/*,{limit:10,skip:skipCount}*/)
});

Meteor.publish('shopinfo',function(idcible) {
    return Shop.findOne(idcible);
});
// Meteor.publish("productdata",function(){
//   return Productdata.find();
// });

Meteor.publish("images", function (argument) {
argument = argument || {};
return Images.find(argument);
});
///////////////////////////////////
Meteor.publish("searchmedocs", function(searchValue) {

    if (!searchValue) {
      return null;
    }
    console.log("Searching for ", searchValue);
    var cursor = Productdata.find(
      { $text: {$search: searchValue} },
      {
        /*
         * `fields` is where we can add MongoDB projections. Here we're causing
         * each document published to include a property named `score`, which
         * contains the document's search rank, a numerical value, with more
         * relevant documents having a higher score.
         */
        fields: {
          score: { $meta: "textScore" }
        },
        /*
         * This indicates that we wish the publication to be sorted by the
         * `score` property specified in the projection fields above.
         */
        sort: {
          score: { $meta: "textScore" }
        }
      },

    );
    return cursor;
  });
Meteor.publish(null,function(){
  return Productdata.find({});
});
/*Meteor.publish("userData", function () {
  if (Meteor.userId()) {
    return Meteor.users.find({});

  } else {
    this.ready();
  }
});*/
Meteor.publish( 'users', function() {
  let isAdmin = Roles.userIsInRole( this.userId, 'admin' );

  if ( isAdmin ) {
    return [
      Meteor.users.find( {})

    ];
  } else {
    return null;
  }
});
Meteor.publish('userData', function () { return Meteor.users.find({}, {fields: {profile: 1}}); });
// Meteor.publish( 'productdata', function( search ) {
//     return Productdata.find( search);
// });
Meteor.publish('cart',function(){
    return Cart.find();});

Meteor.publish('fsrList', function() {
    var fsrlist = Fournisseurs.find();
    return fsrlist });



Meteor.publish('aideSoignants', function () {
  return AideSoignants.find();
});
Meteor.publish('etablissements.all', function () {
  return Etablissements.find();
});

Meteor.publish('etablissements.byId', function (etablissementId) {
  check(etablissementId, String);
  return Etablissements.find({ _id: etablissementId });
});

Meteor.publish('etablissements.filtered', function (filters) {
  check(filters, Object);

  const query = {};

  if (filters.type) {
    query.type = filters.type;
  }
  if (filters.region) {
    query.region = filters.region;
  }
  if (filters.ville) {
    query.ville = filters.ville;
  }
  if (filters.nom) {
    query.nom = { $regex: filters.nom, $options: 'i' };
  }

  return Etablissements.find(query);
});
Meteor.publish('userHistory', function() {
  return UserHistory.find({ userId: this.userId });
});
Meteor.publish('visits.today', function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Visits.find({ date: { $gte: today } });
});
Meteor.publish('visits', function () {
  return Visits.find();
});