var require = meteorInstall({"server":{"methods":{"upload":{"paypal_config.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// server/methods/upload/paypal_config.js                                                                      //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
// Meteor.Paypal.config({
//     'host':'api.sandbox.paypal.com',
//     'port':'',
//     'client_id':'ClientId',
//     'client_secret':'ClientSecret'
//
// });
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"upload.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// server/methods/upload/upload.js                                                                             //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
Meteor.methods({
  parseUpload(data) {
    check(data, Array);

    for (let i = 0; i < data.length; i++) {
      let item = data[i],
          exists = Productdata.findOne({
        _id: item.id
      });

      if (!exists) {
        Productdata.insert(item);
      } else {
        console.warn('Rejected. This item already exists.');
      }
    }
  }

});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"uploadPharm.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// server/methods/upload/uploadPharm.js                                                                        //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
Meteor.methods({
  parseUpload_pharm(data) {
    check(data, Array);

    for (let i = 0; i < data.length; i++) {
      let item = data[i],
          exists = Shop.findOne({
        _id: item.id
      });

      if (!exists) {
        Shop.insert(item);
      } else {
        console.warn('Rejected. This pharmacy already exists.');
      }
    }
  }

});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"Comments.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// server/methods/Comments.js                                                                                  //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
Meteor.methods({
  addComment: function (message, shopId) {
    //get current user
    var user = Meteor.user(); //check if logged in

    if (!user) {
      throw new Meteor.Error('You must be logged in order to submit a comment!');
    } //check message content is not empty


    if (!message) {
      throw new Meteor.Error('invalid-comment', 'Vous devez saisir du texte ,comment can not be empty');
    }

    if (!shopId) {
      throw new Meteor.Error('shop Id undefined');
    } //Shop.update(comments.shopId, {$inc: {commentsCount: 1}});


    Comments.insert({
      Message: message,
      UserId: user._id,
      Author: user.profile.name,
      submitted: new Date(),
      ShopId: shopId,
      AuthorPic: user.profile.avatar_url //commentsCount: 0

    });
  },
  'deleteComment': function (commentId) {
    //get current user
    var user = Meteor.user();

    if (commentId) {
      Comments.remove(commentId);
      alert('comment deleted by' + user.profile.name);
      throw new Meteor.Alert('Confirm ur action');
    }
  }
});
/*

Meteor.methods({
    'addComment':function(message,shopId){

    	var user = Meteor.user();
    	//check if logged in
	    if (!user){
	      throw new Meteor.Error('You must be logged in to submit  comment!');
	    }
    	if (!message){
	      throw new Meteor.Error( 'Vous devez saisir du texte ,comment can not be empty');
	    }
		if (!shopId){
      	  throw new Meteor.Error('shop Id undefined');
    	}

		comment.UserId = user._id;
		comment.Message = message;
		comment.ShopId = shopId;
		comment.Author = user.profile.name;
		comment.submitted = new Date();

        Comments.insert(message,shopId,function(error,result){
      	if(error){
      		console.log("me voici ici"+ error);
      		}
      	});
    }

});
*/

/*
//commentsCount: 0
//Shop.update(comments.shopId, {$inc: {commentsCount: 1}});
    // userId & shopId are our foreign key
*/
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Shop.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// server/methods/Shop.js                                                                                      //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
/**
 * Created by bangt on 04/07/2016.
 */
Meteor.methods({
  'createnewPharm': function (doc) {
    if (!this.userId) {
      return throwError(403, 'Must be logged in');
    }

    console.log("Adding", doc);
    check(doc, Schemas.shop);
    Shop.insert(doc, function (err, _id) {
      console.log("ShopID: ", docID);
    }); //callback error function
  },
  updateShopData: function (doc, docID) {
    if (!this.userId) {
      return throwError(403, 'Must be logged in');
    }

    console.log("Updating", doc);
    check(doc, Shop.simpleSchema());
    Shop.update({
      _id: docID
    }, doc);
  },
  'deleteShop': function (shopId) {
    //get current user
    var user = Meteor.user();

    if (!shopId) {
      throw new Meteor.Error('This pharmacy Id can not be empty');
    }

    Shop.remove(shopId);
    toastr.warning('Another pharmacy deleted by' + user.profile.name);
  },
  upvote: function (shopId) {
    check(this.userId, String);
    check(shopId, String);
    var shop = Shop.findOne(shopId);
    if (!shop) throw new Meteor.Error('invalid', 'Shop not found');
    if (_.include(shop.upvoters, this.userId)) throw new Meteor.Error('invalid', 'Already upvoted this shop');
    Shop.update(shop._id, {
      $addToSet: {
        upvoters: this.userId
      },
      $inc: {
        votes: 1
      }
    });
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"addetablissement.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// server/methods/addetablissement.js                                                                          //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
var _interopRequireDefault = require("@babel/runtime/helpers/builtin/interopRequireDefault");

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/builtin/objectSpread"));

Meteor.methods({
  'etablissements.insert': function (etablissement) {
    check(etablissement, {
      nom: String,
      type: String,
      region: String,
      ville: String,
      quartier: Match.Maybe(String),
      adresse: Match.Maybe(String),
      telephone: Match.Maybe(String),
      email: Match.Maybe(String),
      siteWeb: Match.Maybe(String)
    });
    return Etablissements.insert((0, _objectSpread2.default)({}, etablissement, {
      dateAjout: new Date()
    }));
  },
  'etablissements.importCSV': function (csvData) {
    check(csvData, String);
    const parsed = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true
    });
    parsed.data.forEach(row => {
      if (row.nom && row.type && row.region && row.ville) {
        Etablissements.insert({
          nom: row.nom,
          type: row.type,
          region: row.region,
          ville: row.ville,
          quartier: row.quartier || '',
          adresse: row.adresse || '',
          telephone: row.telephone || '',
          email: row.email || '',
          siteWeb: row.siteWeb || '',
          dateAjout: new Date()
        });
      }
    });
  },
  'etablissements.importXLS': function (base64File) {
    check(base64File, String);
    const binary = Buffer.from(base64File, 'base64');
    const workbook = XLSX.read(binary, {
      type: 'buffer'
    });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(sheet);
    json.forEach(row => {
      if (row.nom && row.type && row.region && row.ville) {
        Etablissements.insert({
          nom: row.nom,
          type: row.type,
          region: row.region,
          ville: row.ville,
          quartier: row.quartier || '',
          adresse: row.adresse || '',
          telephone: row.telephone || '',
          email: row.email || '',
          siteWeb: row.siteWeb || '',
          dateAjout: new Date()
        });
      }
    });
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"addproduct.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// server/methods/addproduct.js                                                                                //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
Meteor.methods({
  ajoutproduit: function (brand, tag, price, desc, category, onpresc, fileShopId, images, addedBy, createdAt, updatedAt) {
    var user = Meteor.user(); //var fileShopId = template.data._id;

    console.log("Adding", brand, tag, price, desc, category, onpresc, images, fileShopId, addedBy, createdAt, updatedAt); //check(doc, String);
    // Make sure the user is logged in before inserting a task

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Productdata.insert({
      brand: brand,
      tag: tag,
      desc: desc,
      category: category,
      onpresc: onpresc,
      price: price,
      fileShopId: fileShopId,
      images: images,
      addedBy: user,
      createdAt: new Date(),
      updatedAt: null
    }); // , function(err, docID) {console.log("productID: ", docID,err);});//callback error function
  },
  'deleteProductdata': function (productid) {
    //get current user
    var user = Meteor.user();

    if (!productid) {
      throw new Meteor.Error('Productdata Id can not be empty');
    }

    Productdata.remove(productdataId);
    toastr.warning('Some product deleted by' + user.profile.name);
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"addstuff.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// server/methods/addstuff.js                                                                                  //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
Meteor.methods({
  addStuff: function (doc) {
    if (!this.userId) {
      return throwError(403, 'Must be logged in');
    }

    console.log("Adding", doc);
    check(doc, Schemas.articledata);
    Articles.insert(doc, function (err, docID) {
      console.log("stuffId: ", docID);
    }); //callback error function
  },
  'deleteArticledata': function (articledataId) {
    //get current user
    var user = Meteor.user();

    if (!articledataId) {
      throw new Meteor.Error('Articles Id can not be empty');
    }

    Articles.remove(articledataId);
    alert('comment deleted by' + user.profile.name);
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"commandyango.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// server/methods/commandyango.js                                                                              //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
let Meteor;
module.watch(require("meteor/meteor"), {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let HTTP;
module.watch(require("meteor/http"), {
  HTTP(v) {
    HTTP = v;
  }

}, 1);
let check;
module.watch(require("meteor/check"), {
  check(v) {
    check = v;
  }

}, 2);
Meteor.startup(() => {// code to run on server at startup
});
Meteor.methods({
  commanderYango(pickup, dropoff) {
    check(pickup, {
      lat: Number,
      lng: Number
    });
    check(dropoff, {
      lat: Number,
      lng: Number
    }); // MOCK de réponse API Yango

    const fakeResponse = {
      status: 'ok',
      car_assigned: true,
      eta_minutes: 5,
      driver_name: 'Jean-Paul',
      car_model: 'Toyota Corolla',
      tracking_url: 'https://yango.mock/tracking/123456'
    };
    return fakeResponse;
  }

});
/* Meteor.methods({
  commanderYango(pickup, dropoff) {
    check(pickup, { lat: Number, lng: Number });
    check(dropoff, { lat: Number, lng: Number });

    const apiKey = Meteor.settings.private.YANGO_API_KEY;

    const endpoint = "https://fleet-api.taxi.yandex.net/v1/parks/order"; // à confirmer selon ton accès
    const payload = {
      source: {
        latitude: pickup.lat,
        longitude: pickup.lng,
      },
      destination: {
        latitude: dropoff.lat,
        longitude: dropoff.lng,
      },
      requirements: {
        // options de trajet (si besoin)
      },
      // Peut inclure park_id, driver_profile_id, etc., selon ton contrat
    };

    try {
      const response = HTTP.call("POST", endpoint, {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        data: payload,
      });

      return response.data;
    } catch (error) {
      console.error("Erreur commande Yango:", error);
      throw new Meteor.Error("yango.error", error.message);
    }
  }
}); */
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"newaidesoignant.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// server/methods/newaidesoignant.js                                                                           //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
Meteor.methods({
  ajoutAidesoignant: function (nom, prenom, specialite, telephone, localisation, disponible, dernierAppel, addedBy, createdAt, updatedAt) {
    var user = Meteor.user(); //var fileShopId = template.data._id;

    console.log("Adding", nom, prenom, specialite, telephone, localisation, disponible, dernierAppel, addedBy, createdAt, updatedAt); //check(doc, String);
    // Make sure the user is logged in before inserting a task

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    AideSoignants.insert({
      nom: nom,
      prenom: prenom,
      specialite: specialite,
      telephone: telephone,
      localisation: localisation,
      disponible: disponible,
      dernierAppel: dernierAppel,
      addedBy: user,
      createdAt: new Date(),
      updatedAt: null
    }); // , function(err, docID) {console.log("AideSoignantId: ", docID,err);});//callback error function
  },
  'deleteAidesoignant': function (AideSoignantId) {
    //get current user
    var user = Meteor.user();

    if (!AideSoignantId) {
      throw new Meteor.Error('AideSoignant Id  can not be empty');
    }

    AideSoignants.remove(AideSoignantId);
    toastr.warning('Some product deleted by' + user.profile.name);
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"picturehandler.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// server/methods/picturehandler.js                                                                            //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
// server/images.js
// var imageStore = new FS.Store.S3("images", {
//     accessKeyId: "xxxx",
//     secretAccessKey: "xxxx",
//     bucket: "www.mybucket.com"
// });
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"scanner.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// server/methods/scanner.js                                                                                   //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
/* import PDFDocument from 'pdfkit';
import { createWriteStream } from 'fs';

Meteor.methods({
  convertToPDF(imagePath) {
    const pdfPath = `${process.env.PWD}/.meteor/local/build/programs/server/tmp/doc_${Date.now()}.pdf`;

    const doc = new PDFDocument();
    doc.pipe(createWriteStream(pdfPath));
    doc.image(imagePath, 0, 0, { fit: [600, 800] });
    doc.end();

    return pdfPath;
  }
});
 */
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"userHistory_methods.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// server/methods/userHistory_methods.js                                                                       //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
let UserHistory;
module.watch(require("/collections/userHistory.js"), {
  UserHistory(v) {
    UserHistory = v;
  }

}, 0);
Meteor.methods({
  'userHistory.increment'(userId, type) {
    check(userId, String);
    check(type, String);
    const validTypes = ['calledPersonnel', 'calledFacility', 'visitedPharmacy', 'searchedDrug', 'comparedPrices']; //if (!validTypes.includes(type)) throw new Meteor.Error('Invalid type');

    UserHistory.update({
      userId
    }, {
      $inc: {
        [type]: 1
      },
      $set: {
        lastUpdated: new Date()
      }
    }, {
      upsert: true
    });
  }

});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"visitTracker.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// server/methods/visitTracker.js                                                                              //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
let Visits;
module.watch(require("/collections/visits.js"), {
  Visits(v) {
    Visits = v;
  }

}, 0);
Meteor.methods({
  'visits.track'() {
    const today = new Date();
    const dateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const visit = Visits.findOne({
      date: dateOnly
    });

    if (visit) {
      Visits.update(visit._id, {
        $inc: {
          count: 1
        }
      });
    } else {
      Visits.insert({
        date: dateOnly,
        count: 1
      });
    }
  }

});
Meteor.methods({
  'logVisit'() {
    const today = new Date();
    const day = today.toISOString().split('T')[0];
    Visits.upsert({
      day
    }, {
      $inc: {
        count: 1
      }
    });
  }

});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"visits.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// server/methods/visits.js                                                                                    //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
let Visits;
module.watch(require("/collections/visits.js"), {
  Visits(v) {
    Visits = v;
  }

}, 0);
let Meteor;
module.watch(require("meteor/meteor"), {
  Meteor(v) {
    Meteor = v;
  }

}, 1);
let WebApp;
module.watch(require("meteor/webapp"), {
  WebApp(v) {
    WebApp = v;
  }

}, 2);
Meteor.startup(() => {
  WebApp.connectHandlers.use((req, res, next) => {
    // Récupérer l'adresse IP (x-forwarded-for peut contenir plusieurs IP séparées par des virgules)
    const forwardedFor = req.headers['x-forwarded-for'];
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : req.socket && req.socket.remoteAddress; // Définir le début de la journée

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Chercher une visite existante pour la même IP aujourd'hui

    const alreadyVisited = Visits.findOne({
      ip,
      date: {
        $gte: today
      }
    }); // Enregistrement s'il n'y a pas encore de visite aujourd'hui

    if (!alreadyVisited) {
      try {
        Visits.insert({
          ip,
          date: new Date(),
          path: req.url,
          userAgent: req.headers['user-agent']
        });
      } catch (error) {
        console.log(error);
      }
    }
    /*  Meteor.setInterval(() => {
     const sevenDaysAgo = new Date();
     sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
       const removedCount = Visits.remove({ date: { $lt: sevenDaysAgo } });
       if (removedCount > 0) {
       console.log(`✅ Nettoyage : ${removedCount} visites supprimées`);
     }
    }, 24 * 60 * 60 * 1000); // tous les 24h  */


    next(); // Continuer la requête
  });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"voiceRecognition.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// server/methods/voiceRecognition.js                                                                          //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
let Meteor;
module.watch(require("meteor/meteor"), {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
Meteor.methods({
  saveSpeechText(text) {
    console.log("Texte reconnu :", text); // Ici, tu peux stocker dans MongoDB ou analyser le texte
  },

  searchPharmacy() {
    console.log("🔍 Recherche de pharmacies..."); // Ici tu peux lancer une recherche en base MongoDB

    return Shop.find().fetch();
  },

  searchHealthPersonnel() {
    console.log("🔍 Recherche de personnels de santé...");
    return AideSoignants.find().fetch();
  },

  searchHealthFacility() {
    console.log("🔍 Recherche de formations sanitaires...");
    return Etablissements.find().fetch();
  }

}
/*  searchPharmacy(filters) {
  console.log("🔍 Recherche pharmacies avec filtres :", filters);
  return Shop.find(filters).fetch();
},
searchHealthPersonnel(filters) {
  console.log("🔍 Recherche personnels avec filtres :", filters);
  return AideSoignants.find(filters).fetch();
},
searchHealthFacility(filters) {
  console.log("🔍 Recherche formations sanitaires avec filtres :", filters);
  return Etablissements.find(filters).fetch();
},
searchDrugs() {
  console.log("🔍 Recherche de medicament...");
  return Productdata.find(filters).fetch();
} */
);
Meteor.startup(() => {
  console.log("Serveur Meteor démarré avec reconnaissance vocale.");
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"collections_server":{"articledata.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// server/collections_server/articledata.js                                                                    //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
// var FS = Npm.require('fs');
//
// var articleStore = new FS.Store.S3("articleStore", {
//   accessKeyId: "a0a2e143ea13c4122aae66d39cbb650151db",
//   secretAccessKey: "91fcee030837ff099deb07ef78d3",
//   bucket: "quickpharmbucket",
//   transformWrite: function(fileObj, readStream, writeStream) {
//     gm(readStream, fileObj.name()).resize('250', '250').stream().pipe(writeStream)
//   }
// })
//
// var articlesThumbs = new FS.Store.S3("articlesThumbs", {
//   accessKeyId: "a0a2e143ea13c4122aae66d39cbb650151db",
//   secretAccessKey: "91fcee030837ff099deb07ef78d3",
//   bucket: "articlethumbsbucket",
//   beforeWrite: function(fileObj) {
//     fileObj.size(20, {store: "articlesThumbs", save: false});
//   },
//   transformWrite: function(fileObj, readStream, writeStream) {
//     gm(readStream, fileObj.name()).resize('20', '20').stream().pipe(writeStream)
//   }
// })
//
//
// Articles = new FS.Collection("articles", {
//   stores: [articleStore, articlesThumbs],
//   filter: {
//     allow: {
//       contentTypes: ['image/*']
//     }
//   }
// })
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"publication.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// server/publication.js                                                                                       //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
let UserHistory;
module.watch(require("/collections/userHistory.js"), {
  UserHistory(v) {
    UserHistory = v;
  }

}, 0);
let Visits;
module.watch(require("/collections/visits.js"), {
  Visits(v) {
    Visits = v;
  }

}, 1);
Meteor.startup(() => {
  Shop._ensureIndex({
    "location": "2dsphere"
  });
});
Meteor.publish("navbar", function () {
  Meteor.users.findOne({
    _id: Meteor.userId
  });
});
Meteor.publish("shoplist", function (sort, limit) {
  return Shop.find({}, {
    sort: sort,
    limit: limit
  });
}); // server/publications.js

Meteor.publish('paginatedShops', function (page, limit) {
  check(page, Number);
  check(limit, Number);
  const skip = (page - 1) * limit;
  return Shop.find({}, {
    skip,
    limit
  });
});
Meteor.publish('paginatedDrugs', function (page, limit) {
  check(page, Number);
  check(limit, Number);
  const skip = (page - 1) * limit;
  return Productdata.find({}, {
    skip,
    limit
  });
});
Meteor.publish('paginatedAssistant', function (page, limit) {
  check(page, Number);
  check(limit, Number);
  const skip = (page - 1) * limit;
  return AideSoignants.find({}, {
    skip,
    limit
  });
});
Meteor.publish("shop", function (search, sort, limit) {
  return Shop.find(search, {
    sort: sort,
    limit: limit
  });
});
Meteor.publish("shopSearch", function (searchData) {
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
Meteor.publish("open", function () {
  return Cards_open.find();
});
Meteor.publish("updateshop", function () {
  return Shop.find();
});
Meteor.publish("comments", function () {
  return Comments.find();
});
/*Meteor.startup(function(){*/

Meteor.publish("showarticle", function (shopId
/*,skipCount*/
) {
  return Articles.find({
    ShopId: shopId
    /*,{limit:10,skip:skipCount}*/

  });
});
Meteor.publish("articlestore", function (shopId
/*,skipCount*/
) {
  return Articles.find({
    ShopId: shopId
    /*,{limit:10,skip:skipCount}*/

  });
});
Meteor.publish('shopinfo', function (idcible) {
  return Shop.findOne(idcible);
}); // Meteor.publish("productdata",function(){
//   return Productdata.find();
// });

Meteor.publish("images", function (argument) {
  argument = argument || {};
  return Images.find(argument);
}); ///////////////////////////////////

Meteor.publish("searchmedocs", function (searchValue) {
  if (!searchValue) {
    return null;
  }

  console.log("Searching for ", searchValue);
  var cursor = Productdata.find({
    $text: {
      $search: searchValue
    }
  }, {
    /*
     * `fields` is where we can add MongoDB projections. Here we're causing
     * each document published to include a property named `score`, which
     * contains the document's search rank, a numerical value, with more
     * relevant documents having a higher score.
     */
    fields: {
      score: {
        $meta: "textScore"
      }
    },

    /*
     * This indicates that we wish the publication to be sorted by the
     * `score` property specified in the projection fields above.
     */
    sort: {
      score: {
        $meta: "textScore"
      }
    }
  });
  return cursor;
});
Meteor.publish(null, function () {
  return Productdata.find({});
});
/*Meteor.publish("userData", function () {
  if (Meteor.userId()) {
    return Meteor.users.find({});

  } else {
    this.ready();
  }
});*/

Meteor.publish('users', function () {
  let isAdmin = Roles.userIsInRole(this.userId, 'admin');

  if (isAdmin) {
    return [Meteor.users.find({})];
  } else {
    return null;
  }
});
Meteor.publish('userData', function () {
  return Meteor.users.find({}, {
    fields: {
      profile: 1
    }
  });
}); // Meteor.publish( 'productdata', function( search ) {
//     return Productdata.find( search);
// });

Meteor.publish('cart', function () {
  return Cart.find();
});
Meteor.publish('fsrList', function () {
  var fsrlist = Fournisseurs.find();
  return fsrlist;
});
Meteor.publish('aideSoignants', function () {
  return AideSoignants.find();
});
Meteor.publish('etablissements.all', function () {
  return Etablissements.find();
});
Meteor.publish('etablissements.byId', function (etablissementId) {
  check(etablissementId, String);
  return Etablissements.find({
    _id: etablissementId
  });
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
    query.nom = {
      $regex: filters.nom,
      $options: 'i'
    };
  }

  return Etablissements.find(query);
});
Meteor.publish('userHistory', function () {
  return UserHistory.find({
    userId: this.userId
  });
});
Meteor.publish('visits.today', function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Visits.find({
    date: {
      $gte: today
    }
  });
});
Meteor.publish('visits', function () {
  return Visits.find();
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"roles.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// server/roles.js                                                                                             //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
//creation de l'administrateur systeme
Meteor.startup(function () {
  if (Meteor.users.find().count() < 1) {
    var id = Accounts.createUser({
      email: 'gilles.nkouyee@gmail.com',
      password: 'adminadmin2014',
      profile: {
        name: 'Gilles.Arsene',
        avatar_url: '/ad4.jpg',
        lastname: 'Nkouye\'e',
        mobile: '699103611/681238611',
        occupation: 'Developer',
        status: 'Work hard ; Play hard !',
        birthday: '10/04/1984',
        organization: '',
        website: '',
        bio: '',
        gender: ''
      }
    });
    Roles.addUsersToRoles(id, 'admin');
  }
}); //Attribue le role 'default' a un utilisateur qui se logue sans avoir deja un role defini par l'admin

Accounts.onLogin(function (user) {
  var user = user.user;
  var defaultRole = ['basic'];

  if (!user.roles) {
    Roles.addUsersToRoles(user, defaultRole);
  }

  ;
});
Accounts.validateLoginAttempt(function (attempt) {
  if (Roles.userIsInRole(attempt.user._id, ['inactive'])) {
    attempt.allowed = false;
    throw new Meteor.Error(403, "User account is inactive!");
  }

  return true;
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"smtp.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// server/smtp.js                                                                                              //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
Meteor.startup(function () {
  process.env.MAIL_URL = 'smtp://gillesnkouye@gmail.com:Oathniel@Jnmm2024@smtp.gmail.com:587/';
});
Meteor.methods({
  'sendEmail': function (to, cc, from, subject, replyTo, emailData, error) {
    //check([to, from, subject,replyTo,emailData], [String]);
    console.log("about to send email...");
    this.unblock();

    if (error) {
      console.log("Error: " + error.reason);
    }

    ;
    SSR.compileTemplate('htmlEmail', Assets.getText('html-email.html'));
    Email.send({
      to: to,
      cc: cc,
      from: from,
      subject: subject,
      replyTo: replyTo,
      html: SSR.render('htmlEmail', emailData),
      attachements: [{}]
    });
  }
});
/*Meteor.startup(function () {
try {
  var result = AppWorkshop.sendSMS('+237699103611', "G'day MO' P !!");
  console.log("result:");
  console.log(result);
} catch (error) {
  console.log("error:");
  console.log(error);
}
});
Meteor.methods({
  sendSMSFromServer: function (recipient) {
    var result = AppWorkshop.sendSMS(recipient, "Test SMS!");
    return result;
  }
});*/
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"startup.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// server/startup.js                                                                                           //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
Meteor.startup(function () {
  Productdata._ensureIndex({
    "brand": "text"
  }); // seed();
  // if (!document.cookie.match("searchresults="))
  //   $('body').append(Meteor.ui.render(Template.searchresults));   

});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"users.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// server/users.js                                                                                             //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
Meteor.methods({
  setRoleOnUser(options) {
    check(options, {
      user: String,
      role: String
    });

    try {
      Roles.setUserRoles(options.user, [options.role]);
    } catch (exception) {
      return exception;
    }
  }

});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"main.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// server/main.js                                                                                              //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
let Meteor;
module.watch(require("meteor/meteor"), {
  Meteor(v) {
    Meteor = v;
  }

}, 0);

if (Meteor.isClient) {
  SimpleChat.configure({
    texts: {
      loadMore: 'Load More',
      placeholder: 'Type message ...',
      button: 'send',
      join: 'Join to',
      left: 'Left the',
      room: 'room at'
    },
    limit: 5,
    beep: true,
    showViewed: true,
    showReceived: true,
    showJoined: true,
    publishChats: function (roomId, limit) {
      //server
      return true;
    },
    allow: function (message, roomId, username, avatar, name) {
      return true;
    },
    onNewMessage: function (msg) {//both
    },
    onReceiveMessage: function (id, message, room) {//server
    },
    onJoin: function (roomId, username, name, date) {//server
    },
    onLeft: function (roomId, username, name, date) {//server
    }
  });
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"Lib":{"both.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// Lib/both.js                                                                                                 //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
// in /lib needed on both client and server
// var throwError = function(error, reason, details) {
//   error = new Meteor.Error(error, reason, details);
//   if (Meteor.isClient) {
//     return error;
//   } else if (Meteor.isServer) {
//     throw error;
//   }
// };
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"collections":{"Post.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// collections/Post.js                                                                                         //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
Posts = new Mongo.Collection('posts'); // Schemas = {};

Posts.allow({
  insert: function (userId, doc) {
    return true;
  },
  update: function (userId, doc, fieldNames, modifier) {
    return true;
  },
  remove: function (userId, doc) {
    return true;
  },
  fetch: ['owner']
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Productscoll.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// collections/Productscoll.js                                                                                 //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
Productdata = new Mongo.Collection('productdata');
Productdata.allow({
  insert: function (userId, doc) {
    return true;
  },
  update: function (userId, doc, fieldNames, modifier) {
    return true;
  },
  remove: function (userId, doc) {
    return true;
  },
  fetch: ['owner']
}); //  Productdata.attachSchema ( new SimpleSchema({
//       price:{
//         type: Number,
//         label:"Price"
//       },
//       tag :{
//   				type: String,
//   				label:"Tag",
//   				allowedValues: ['Nourrissons', 'Enfants', 'Adultes'],
//   			    autoform: {
//   			      options: [
//   			        {label: "Nourrissons", value: "Nourrissons"},
//   			        {label: "Enfants", value: "Enfants"},
//   			        {label: "Adultes", value: "Adultes"}
//
//   			      ]
//   			    }
//   			},
//       brand:{
//                 type: String,
//                 label:"Brand",
//                 max: 250
//               },
//
//       images: {
//           type: String,
//           label:"images",
//           autoform: {
//             afFieldInput: {
//               type: "cfs-file",
//               collection: 'articles',
//               uploadProgressTemplate:'Loading'
//             }
//         }
//      },
//      description :{
//    				type: String,
//    				label:"Description",
//    				autoform:{
//    					placeholder: 'Short (less than 100 characters)',
//          				rows: 3
//    				}
//    			},
//         classe :{
//       				type: String,
//       				label:"Classe",
//               allowedValues: ['Antibiotique', 'Antifongique', 'Di-antalgique'],
//       			    autoform: {
//       			      options: [
//       			        {label: "Antibiotique", value: "Antibiotique"},
//       			        {label: "Antifongique", value: "Antifongique"},
//       			        {label: "Di-antalgique", value: "Di-antalgique"}
//
//       			      ]
//       			    }
//       			},
//    	addedBy: {
//    				type: String,
//    				label: "Created By",
//    				autoValue: function() {
//    				if (this.isInsert) {
//    				return this.user;
//    			}
//    		},
//    		autoform: {
//    				type:"hidden"
//    			}
//    	},
//    	createdAt: {
//    				type: Date,
//    				label: "Created At",
//    				autoValue: function() {
//    				if (this.isInsert) {
//    				return new Date;
//    			}
//    		},
//    		autoform: {
//    				type:"hidden"
//    			}
//    	},
//    	updatedAt: {
//    				type: Date,
//    				label: "Updated At",
//    				autoValue: function() {
//    				if (this.isUpdate) {
//    				return new Date();
//    			}
//    		},
//    			autoform: {
//    				type:"hidden"
//    			},
//    			denyInsert: true,
//    			optional: true
//    	},
//
//     fileShopId: {
//         type: String,
//         label:"fileShopId",
//             autoValue: function() {
//             if (this.isInsert) {
//             return this._id;
//             }
//         autoform: {
//     				type:"hidden"
//     			}
//         }
//       }
// }));
// Productdata.attachSchema(Schemas.productdata);
// productdata = "Productdata";
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"User.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// collections/User.js                                                                                         //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
// // Schema du profil
// Globals.schemas.UserProfile = SimpleSchema({
//     name: {
//       type:String,
//       regEx:/^[a-zA-Z-]{2,25}/,
//       optional:true,
//       label:"Prenom"
//     },
//     lastname: {
//       type:String,
//       regEx:/^[a-zA-Z-]{2,25}/,
//       optional:true,
//       label:"Nom"
//     },
//     birthday: {
//       type: Date,
//       optional: true,
//       label: "Date de naissance"
//     },
//     gender:{
//       type:String,
//       allowedValues: ['M','F'],
//       optional:true,
//       label:"Genre",
//       autoform: {
//         afFieldInput: {
//           type:"select2",
//           options: [
//               {
//                 value:"M",
//                 label:"Homme"
//               },
//               {
//                 value:"F",
//                 label:"Femme"
//               }
//           ]
//         }
//       }
//     },
//     avatar_url: {
//       type: String,
//       label:"Picture",
//       autoform: {
//         afFieldInput: {
//           type: "cfs-file",
//           collection: "images"
//         }
//       }
//     },
//     organization: {
//       type:String,
//       regEx:/^[a-zA-Z-]{2,25}/,
//       optional:true,
//       label:"Organisation"
//     },
//     occupation: {
//       type:String,
//       regEx:/^[a-z0-9A-Z .]{3,30}$/,
//       optional:true,
//       label:"Occupation"
//     },
//     mobile: {
//       type:String,
//       regEx:/^[a-zA-Z-]{2,25}/,
//       optional:true,
//       label:"Phone Number"
//     },
//     website: {
//       type:String,
//       regEx:SimpleSchema.RegEx.Url,
//       optional:true,
//       label:"Site Web"
//     },
//     bio: {
//       type:String,
//       optional:true,
//       label:"Biographie",
//       autoform: {
//         afFieldInput:{
//           type:"textarea"
//         }
//       }
//     },
//     status: {
//       type:String,
//       optional:true,
//       label:"Statut",
//       autoform: {
//         afFieldInput:{
//           type:"textarea"
//         }
//       }
//     }
// })
// //Schema principal
// Globals.schemas.User = new SimpleSchema({
//     username:{
//       type: String,
//       regEx:/^[a-z0-9A-Z_]{3,15}$/,
//       label:"Nom d'utilisateur"
//     },
//     password: {
//       type:String,
//       label:"Mot de passe",
//       optional:true,
//       autoform: {
//         afFieldInput:{
//           type:"password"
//         }
//       }
//     },
//     confirmation: {
//       type:String,
//       label:"Confirmation",
//       optional:true,
//       custom: function(){
//           if (this.value !== this.field('password').value){
//               return "passwordMissmatch";
//           }
//       },
//       autoform: {
//         afFieldInput:{
//           type:"password"
//         }
//       }
//     },
//     emails:{
//       type:[Object],
//       optional: false,
//       label: "Adresses Email"
//     },
//     "emails.$.address": {
//       type: String,
//       regEx: SimpleSchema.RegEx.Email,
//       label: "Adresse"
//     },
//     "emails.$.verified": {
//       type: Boolean,
//       optional:true,
//       autoform: {
//         omit: true
//       }
//     },
//     createdAt: {
//         type: Date,
//         autoValue: function () {
//             if (this.isInsert) {
//               return new Date;
//             }else {
//               this.unset();
//             }
//         },
//         autoform: {
//             omit: true
//         }
//     },
//     profile: {
//         type: Globals.schemas.userProfile,
//         optional: true,
//
//     },
//     services: {
//         type: Object,
//         optional: true,
//         blackbox: true,
//         autoform:{
//             omit:true
//         }
//     },
//     roles: {
//       type: [String],
//       optional: true,
//       autoform:{
//         omit: true
//       }
//     }
//
// });
// //on attache ce schema á la collection
// Meteor.users.attachSchema(Globals.schemas.User);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"aideSoignants.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// collections/aideSoignants.js                                                                                //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
AideSoignants = new Mongo.Collection('aideSoignants');
Schemas = {};
AideSoignants.allow({
  insert: function (userId, doc) {
    return true;
  },
  update: function (userId, doc, fieldNames, modifier) {
    return true;
  },
  remove: function (userId, doc) {
    return true;
  },
  fetch: ['owner']
});
AideSoignants.schema = new SimpleSchema({
  nom: {
    type: String
  },
  prenom: {
    type: String
  },
  specialite: {
    type: String
  },
  telephone: {
    type: String
  },
  region: {
    type: String,
    label: "Région"
  },
  ville: {
    type: String,
    label: "Ville"
  },
  quartier: {
    type: String,
    optional: true,
    label: "Quartier"
  },
  localisation: {
    type: Object,
    optional: true
  },
  'localisation.lat': {
    type: Number,
    label: "Latitude",
    decimal: true,
    autoform: {
      step: 0.000001
    }
  },
  'localisation.lng': {
    type: Number,
    label: "Longitude",
    decimal: true,
    autoform: {
      step: 0.000001
    }
  },
  disponible: {
    type: Boolean,
    defaultValue: true
  },
  dernierAppel: {
    type: Date,
    optional: true
  },
  // 🆕 Ajout du champ imbriqué pour les documents
  documents_perso: {
    type: Object,
    label: "Documents Personnels",
    optional: true
  },
  'documents_perso.cni': {
    type: String,
    label: "Carte Nationale d'Identité (PDF)",
    optional: true,
    autoform: {
      afFieldInput: {
        type: "cfs-file",
        collection: "documents",
        accept: 'application/pdf'
      }
    }
  },
  'documents_perso.diplome': {
    type: String,
    label: "Diplome (PDF)",
    optional: true,
    autoform: {
      afFieldInput: {
        type: "cfs-file",
        collection: "documents",
        accept: 'application/pdf'
      }
    }
  },
  'documents_perso.cv': {
    type: String,
    optional: true,
    label: "Curriculum Vitae (PDF)",
    autoform: {
      afFieldInput: {
        type: "cfs-file",
        collection: "documents",
        accept: 'application/pdf'
      }
    }
  },
  createdAt: {
    type: Date,
    label: "Created At",
    autoValue: function () {
      if (this.isInsert) return new Date();
    },
    autoform: {
      type: "hidden"
    }
  },
  addedBy: {
    type: String,
    label: "Created By",
    autoValue: function () {
      if (this.isInsert) return this.userId;
    },
    autoform: {
      type: "hidden"
    }
  },
  updatedAt: {
    type: Date,
    label: "Updated At",
    autoValue: function () {
      if (this.isUpdate) return new Date();
    },
    autoform: {
      type: "hidden"
    },
    denyInsert: true,
    optional: true
  }
});
AideSoignants.attachSchema(AideSoignants.schema);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"articlecoll.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// collections/articlecoll.js                                                                                  //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
//
//   var articleStore = new FS.Store.S3("articleStore",{
//     region: "us-east-1", //optional in most cases
//     accessKeyId: "a0a2e143ea13c4122aae66d39cbb650151db", //required if environment variables are not set
//     secretAccessKey: "91fcee030837ff099deb07ef78d3", //required if environment variables are not set
//     bucket: "quickpharmbucket", //required
//     ACL: "private", //optional, default is 'private', but you can allow public or secure access routed through your app URL
//     folder: "folder/in/bucket", //optional, which folder (key prefix) in the bucket to use
//     // The rest are generic store options supported by all storage adapters
//     //transformWrite: myTransformWriteFunction, //optional
//     //transformRead: myTransformReadFunction, //optional
//     maxTries: 5 //optional, default 5);
//   });
//   var articlesThumbs = new FS.Store.S3("articlesThumbs",{
//     region: "us-east-1", //optional in most cases
//     accessKeyId: "a0a2e143ea13c4122aae66d39cbb650151db", //required if environment variables are not set
//     secretAccessKey: "91fcee030837ff099deb07ef78d3", //required if environment variables are not set
//     bucket: "articlethumbsbucket", //required
//     ACL: "private", //optional, default is 'private', but you can allow public or secure access routed through your app URL
//     folder: "folder/in/bucket", //optional, which folder (key prefix) in the bucket to use
//     // The rest are generic store options supported by all storage adapters
//     //transformWrite: myTransformWriteFunction, //optional
//     //transformRead: myTransformReadFunction, //optional
//     maxTries: 5 //optional, default 5);
//   });
//
//   var createThumb = function(fileObj, readStream, writeStream){
//   //transform image into  a 10*10 pixel thumbnail
//   gm(readStream, fileObj.name()).resize('10','10').stream().pipe(writeStream);
// };
var articleStore = new FS.Store.FileSystem("articles" // ,{
//   	path: "./uploads/articles",
// maxTries:5
// }
);
Articles = new FS.Collection("articles", {
  stores: [articleStore] // new FS.Store.FileSystem("thumbs",{ transformWrite: createThumb})]
  // , filter: {
  //       allow: {
  //         contentTypes: ['image/jpg']
  //
  //       },
  //
  //       onInvalid: function(message) {
  //         console.log(message);
  //       }
  //     }

}); //Articles collection permission
// var articleStore = new FS.Store.S3("images", {
//     accessKeyId: "xxxx",
//     secretAccessKey: "xxxx",
//     bucket: "www.mybucket.com"
// });
//if(Meteor.isServer){

Articles.allow({
  insert: function (userId, doc) {
    return true;
  },
  update: function (userId, doc, fieldNames, modifier) {
    return true;
  },
  remove: function (userId, doc) {
    return true;
  },
  download: function () {
    return true;
  },
  fetch: ['Owner']
}); //}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"cartcoll.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// collections/cartcoll.js                                                                                     //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
Cart = new Mongo.Collection("cart");
Cart.allow({
  insert: function (userId, doc) {
    return true;
  },
  update: function (userId, doc, fieldNames, modifier) {
    return true;
  },
  remove: function (userId, doc) {
    return true;
  },
  fetch: ['owner']
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"documents.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// collections/documents.js                                                                                    //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
Documents = new FS.Collection("documents", {
  stores: [new FS.Store.FileSystem("documents", {
    path: "~/uploads/documents"
  })]
});
Documents.allow({
  insert: () => true,
  update: () => true,
  remove: () => true,
  download: () => true
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"etablissements.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// collections/etablissements.js                                                                               //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
const {
  Select
} = require("semantic-ui-react");

Etablissements = new Mongo.Collection('etablissements');
Etablissements.allow({
  insert: function (userId, doc) {
    return true;
  },
  update: function (userId, doc, fieldNames, modifier) {
    return true;
  },
  remove: function (userId, doc) {
    return true;
  },
  fetch: ['owner']
});
Schemas = {};
Etablissements.attachSchema(new SimpleSchema({
  nom: {
    type: String,
    label: "Nom de l'établissement"
  },
  type: {
    type: String,
    allowedValues: ["Hôpital général", "Hôpital central", "Hôpital de district", "Clinique", "Centre de santé", "Dispensaire", "Laboratoire d’analyses", "Centre de diagnostic", "Centre de santé intégré", "Hôpital de district", "Centre d’imagerie", "Centre ophtalmologique", "Centre de Maternité", "Centre de Gynécologie", "Centre Pédiatrique", "Cabinet médical", "Cabinet dentaire", "Centre de rééducation", "Autre"],
    label: "Type d'établissement"
  },
  region: {
    type: String,
    label: "Région"
  },
  ville: {
    type: String,
    label: "Ville"
  },
  quartier: {
    type: String,
    optional: true,
    label: "Quartier"
  },
  adresse: {
    type: String,
    optional: true,
    label: "Adresse complète"
  },
  localisation: {
    type: Object,
    optional: true
  },
  'localisation.lat': {
    type: Number,
    label: "Latitude",
    decimal: true,
    autoform: {
      step: 0.000001
    }
  },
  'localisation.lng': {
    type: Number,
    label: "Longitude",
    decimal: true,
    autoform: {
      step: 0.000001
    }
  },
  telephone: {
    type: String,
    optional: true,
    label: "Téléphone"
  },
  email: {
    type: String,
    optional: true,
    regEx: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    label: "Email"
  },
  siteWeb: {
    type: String,
    optional: true,
    label: "Site Web"
  },
  dateAjout: {
    type: Date,
    defaultValue: new Date(),
    label: "Date d'ajout"
  }
}));
Etablissements.attachSchema(Schemas.Etablissements);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"fournisseur.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// collections/fournisseur.js                                                                                  //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
Fournisseurs = new Mongo.Collection('fournisseurs');
Fournisseurs.allow({
  insert: function (userId, doc) {
    return true;
  },
  update: function (userId, doc, fieldNames, modifier) {
    return true;
  },
  remove: function (userId, doc) {
    return true;
  },
  fetch: ['owner']
});
Schemas = {};
Fournisseurs.attachSchema(new SimpleSchema({
  name: {
    type: String,
    regEx: /^[a-z0-9A-Z .]{3,30}$/,
    label: "Label"
  },
  website: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    optional: true,
    label: "Site Web"
  },
  emails: {
    type: String,
    optional: false,
    label: "Adresses Email"
  },
  mobile: {
    type: String,
    regEx: /^[a-zA-Z-]{2,25}/,
    optional: true,
    label: "Phone Number"
  },
  adress: {
    type: String,
    label: "Adresse",
    autoform: {
      afFieldInput: {
        type: "textarea",
        class: "ckeditor",
        rows: 2
      }
    }
  },
  createdAt: {
    type: Date,
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      } else {
        this.unset();
      }
    },
    autoform: {
      omit: true
    }
  },
  lastUpdate: {
    type: Date,
    optional: true,
    autoform: {
      omit: true
    },
    autoValue: function () {
      if (this.isUpdate) {
        return new Date();
      } else {
        this.unset();
      }
    }
  },
  createdBy: {
    type: String,
    autoform: {
      omit: true
    },
    autoValue: function () {
      if (this.isInsert) {
        return Meteor.userId();
      } else {
        this.unset();
      }
    }
  }
}));
Fournisseurs.attachSchema(Schemas.Fournisseurs);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"mesImages.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// collections/mesImages.js                                                                                    //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
imageStore = new FS.Store.FileSystem("images", {
  path: "~/uploads/images"
});
Images = new FS.Collection("images", {
  stores: [imageStore]
});
Images.allow({
  insert: function () {
    return true;
  },
  update: function () {
    return true;
  },
  remove: function () {
    return true;
  },
  download: function () {
    return true;
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"shopcollection.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// collections/shopcollection.js                                                                               //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
shop = "Shop";
Shop = new Mongo.Collection('shop');
Meteor.startup(function () {//Shop._ensureIndex({"location.geometry": "2dsphere"});
});
Schemas = {}; //Shop collection permission

Shop.allow({
  insert: function (userId, doc) {
    return true;
  },
  update: function (userId, doc, fieldNames, modifier) {
    return true;
  },
  remove: function (userId, doc) {
    return true;
  },
  fetch: ['owner']
}); //Shop autoform with a shopitem autorm included
// Teammember SimpleSchema

teamMber = new SimpleSchema({
  Nom: {
    type: String,
    label: "Nom",
    regEx: /^[a-zA-Z-]{2,25}/
  },
  Prenom: {
    type: String,
    label: "Prenom",
    regEx: /^[a-zA-Z-]{2,25}/
  },
  photo: {
    type: String,
    label: "Photo",
    autoform: {
      afFieldInput: {
        type: "cfs-file",
        collection: 'articles'
      }
    }
  },
  birthday: {
    type: Date,
    optional: true,
    label: "Date de naissance"
  },
  // gender:{
  //   type:String,
  //   optional: true,
  //   allowedValues: ['M','F'],
  //   label:"Genre",
  //   autoform: {
  //     afFieldInput: {
  //       type:"select-checkbox-inline",
  //       options: function() {
  //           return [{
  //             label:"Homme",
  //             value: M
  //           },
  //           {
  //             label:"Femme",
  //             value: F
  //           }]
  //        }
  //     }
  //   }
  // },
  bio: {
    type: String,
    optional: true,
    label: "Biographie",
    autoform: {
      afFieldInput: {
        type: "textarea"
      }
    }
  },
  Poste: {
    type: String,
    label: "Fonction",
    allowedValues: ['Pharmacien', 'Caissier', 'Receptionist'],
    autoform: {
      options: [{
        label: "Pharmacien",
        value: "Pharmacien"
      }, {
        label: "Caissier(e)",
        value: "Caissier"
      }, {
        label: "Receptionist(e)",
        value: "Receptionist"
      }]
    }
  }
});
shopitem = new SimpleSchema({
  picture: {
    type: String,
    label: "Panneau d'entête",
    autoform: {
      afFieldInput: {
        type: "cfs-file",
        collection: 'articles'
      }
    }
  },
  tag: {
    type: String,
    label: "Categorie",
    allowedValues: ['communaute', 'Hopital', 'clinique', "consultation", "reglementation", "soins ambulatoires", "soins à domicile"],
    autoform: {
      options: [{
        label: "Communaute",
        value: "communaute"
      }, {
        label: "Hôpital",
        value: "Hopital"
      }, {
        label: "Clinique",
        value: "clinique"
      }, {
        label: "Consultation",
        value: "consultation"
      }, {
        label: "Soins ambulatoires",
        value: "soins ambulatoires"
      }, {
        label: "Reglementation",
        value: "reglementation"
      }, {
        label: "Soins à domicile",
        value: "soins à domicile"
      }]
    }
  }
}); //Shop._ensureIndex({ "location": "2dsphere"});

Schemas.Address = new SimpleSchema({
  lng: {
    type: Number,
    decimal: true,
    min: -180,
    max: 180
  },
  lat: {
    type: Number,
    decimal: true,
    min: -90,
    max: 90
  }
});
Shop.attachSchema(new SimpleSchema({
  shopname: {
    type: String,
    label: "Name",
    max: 200,
    custom: function () {
      if ((this.value || "").toLowerCase() == (this.field("shopowner").value || "").toLowerCase()) {
        return "shopowner_shopname_same";
      }
    }
  },
  shopowner: {
    type: String,
    label: "Owner",
    regEx: /^[a-zA-Z-]{2,25}/,
    max: 200,
    custom: function () {
      if ((this.value || "").toLowerCase() == (this.field("shopname").value || "").toLowerCase()) {
        return "shopname_shopowner_same";
      }
    }
  },
  shopadress: {
    type: String,
    label: "Adresse",
    max: 250
  },
  region: {
    type: String,
    label: "Région"
  },
  ville: {
    type: String,
    label: "Ville"
  },
  shoptel: {
    type: String,
    // regEx:/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
    label: "Phone"
  },
  shopmail: {
    type: String,
    optional: false,
    label: "Adresses Email"
  },
  shoplogo: {
    type: String,
    label: "logo",
    autoform: {
      afFieldInput: {
        type: "cfs-file",
        collection: 'articles',
        uploadProgressTemplate: 'Loading'
      }
    }
  },
  shopstyle: {
    type: String,
    label: "Classe",
    allowedValues: ['hommes', 'femmes', 'enfants', 'mixte'],
    autoform: {
      options: [{
        label: "Hommes",
        value: "hommes"
      }, {
        label: "Femmes",
        value: "femmes"
      }, {
        label: "Enfants",
        value: "enfants"
      }, {
        label: "Mixte",
        value: "mixte"
      }]
    }
  },
  shopslogan: {
    type: String,
    label: "Slogan",
    autoform: {
      placeholder: 'Short (less than 100 characters)',
      rows: 3
    }
  },
  garde: {
    type: String,
    label: "Garde",
    allowedValues: ['oui', 'non'],
    autoform: {
      options: [{
        label: "OUI",
        value: "oui"
      }, {
        label: "NON",
        value: "non"
      }]
    }
  },
  shopTeam: {
    type: [teamMber],
    label: "Equipe",
    optional: true
  },
  shopitems: {
    type: [shopitem],
    label: "Items"
  },
  createdBy: {
    type: String,
    label: "Created By",
    autoValue: function () {
      if (this.isInsert) {
        return this.userId;
      }
    },
    autoform: {
      type: "hidden"
    }
  },
  createdAt: {
    type: Date,
    label: "Created At",
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      }
    },
    autoform: {
      type: "hidden"
    }
  },
  updatedAt: {
    type: Date,
    label: "Updated At",
    autoValue: function () {
      if (this.isUpdate) {
        return new Date();
      }
    },
    autoform: {
      type: "hidden"
    },
    denyInsert: true,
    optional: true
  },
  location: {
    type: Schemas.Address,
    autoform: {
      label: false,
      placeholder: "Address"
    }
  },
  upvoters: {
    type: String,
    autoValue: function () {
      if (this.isInsert) {
        return this.userId;
      } else {
        if (this.isUpdate) {
          return this.userId;
        }
      }
    },
    autoform: {
      type: "hidden"
    }
  },
  votes: {
    type: Number,
    label: "Like",
    defaultValue: '0',
    autoform: {
      type: "hidden"
    }
  }
}));
Shop.attachSchema(Schemas.shop); //recherche de shopping

Schemas.Search = new SimpleSchema({
  location: {
    type: Schemas.Address,
    autoform: {
      label: false,
      placeholder: "Address"
    }
  },
  radius: {
    type: Number,
    autoform: {
      label: false,
      placeholder: "Radius (km)"
    }
  }
}); //Cards_open collection permission

Cards_open = new Mongo.Collection('open');
Cards_open.allow({
  insert: function (userId, doc) {
    return true;
  },
  update: function (userId, doc, fieldNames, modifier) {
    return true;
  },
  remove: function (userId, doc) {
    return true;
  },
  fetch: ['owner']
}); //comments collection controller

Comments = new Mongo.Collection('comment');
Comments.allow({
  insert: function (userId, doc) {
    return true;
  },
  update: function (userId, doc, fieldNames, modifier) {
    return true;
  },
  remove: function (userId, doc) {
    return true;
  },
  fetch: ['owner']
}); /////////////////////////////////////////////googlemap

/*var Post = BaseModel.extendAndSetupCollection("posts");

LikeableModel.makeLikeable(Post, "post");


var Shoplike = BaseModel.extendAndSetupCollection("Shop");

LikeableModel.makeLikeable(Shoplike, "shoplike");*/
//Productdata permission
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"userHistory.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// collections/userHistory.js                                                                                  //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
module.export({
  UserHistory: () => UserHistory
});
let Mongo;
module.watch(require("meteor/mongo"), {
  Mongo(v) {
    Mongo = v;
  }

}, 0);
const UserHistory = new Mongo.Collection('userHistory');
Schemas = {};
UserHistory.allow({
  insert: function (userId, doc) {
    return true;
  },
  update: function (userId, doc, fieldNames, modifier) {
    return true;
  },
  remove: function (userId, doc) {
    return true;
  },
  fetch: ['owner']
});
UserHistory.schema = new SimpleSchema({
  userId: {
    type: String
  },
  calledPersonnel: {
    type: Number,
    defaultValue: 0,
    optional: true
  },
  calledFacility: {
    type: Number,
    defaultValue: 0,
    optional: true
  },
  visitedPharmacy: {
    type: Number,
    defaultValue: 0,
    optional: true
  },
  searchedDrug: {
    type: Number,
    defaultValue: 0,
    optional: true
  },
  comparedPrices: {
    type: Number,
    defaultValue: 0,
    optional: true
  },
  lastUpdated: {
    type: Date,
    optional: true
  }
});
UserHistory.attachSchema(UserHistory.schema);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"visits.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// collections/visits.js                                                                                       //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
module.export({
  Visits: () => Visits
});
let Mongo;
module.watch(require("meteor/mongo"), {
  Mongo(v) {
    Mongo = v;
  }

}, 0);
const Visits = new Mongo.Collection('visits');
const VisitsSchema = new SimpleSchema({
  ip: {
    type: String,
    label: "Adresse IP",
    regEx: SimpleSchema.RegEx.IP,
    optional: true
  },
  date: {
    type: Date,
    label: "Date de la visite",
    optional: true
  },
  path: {
    type: String,
    label: "URL visitée",
    optional: true
  },
  userAgent: {
    type: String,
    label: "Agent utilisateur",
    optional: true
  },
  count: {
    type: Number,
    label: "Nombre de visites",
    defaultValue: 1,
    optional: true
  },
  day: {
    type: String,
    regEx: /^\d{4}-\d{2}-\d{2}$/ // format ISO 8601 : "2025-08-06"

  }
});
Visits.attachSchema(VisitsSchema);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("/server/methods/upload/paypal_config.js");
require("/server/methods/upload/upload.js");
require("/server/methods/upload/uploadPharm.js");
require("/server/collections_server/articledata.js");
require("/server/methods/Comments.js");
require("/server/methods/Shop.js");
require("/server/methods/addetablissement.js");
require("/server/methods/addproduct.js");
require("/server/methods/addstuff.js");
require("/server/methods/commandyango.js");
require("/server/methods/newaidesoignant.js");
require("/server/methods/picturehandler.js");
require("/server/methods/scanner.js");
require("/server/methods/userHistory_methods.js");
require("/server/methods/visitTracker.js");
require("/server/methods/visits.js");
require("/server/methods/voiceRecognition.js");
require("/Lib/both.js");
require("/collections/Post.js");
require("/collections/Productscoll.js");
require("/collections/User.js");
require("/collections/aideSoignants.js");
require("/collections/articlecoll.js");
require("/collections/cartcoll.js");
require("/collections/documents.js");
require("/collections/etablissements.js");
require("/collections/fournisseur.js");
require("/collections/mesImages.js");
require("/collections/shopcollection.js");
require("/collections/userHistory.js");
require("/collections/visits.js");
require("/server/publication.js");
require("/server/roles.js");
require("/server/smtp.js");
require("/server/startup.js");
require("/server/users.js");
require("/server/main.js");
//# sourceURL=meteor://💻app/app/app.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvdXBsb2FkL3BheXBhbF9jb25maWcuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3VwbG9hZC91cGxvYWQuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3VwbG9hZC91cGxvYWRQaGFybS5qcyIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvQ29tbWVudHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL1Nob3AuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL2FkZGV0YWJsaXNzZW1lbnQuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL2FkZHByb2R1Y3QuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL2FkZHN0dWZmLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9jb21tYW5keWFuZ28uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL25ld2FpZGVzb2lnbmFudC5qcyIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvcGljdHVyZWhhbmRsZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3NjYW5uZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3VzZXJIaXN0b3J5X21ldGhvZHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3Zpc2l0VHJhY2tlci5qcyIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvdmlzaXRzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy92b2ljZVJlY29nbml0aW9uLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvY29sbGVjdGlvbnNfc2VydmVyL2FydGljbGVkYXRhLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcHVibGljYXRpb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9yb2xlcy5qcyIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3NtdHAuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGFydHVwLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvdXNlcnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tYWluLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9MaWIvYm90aC5qcyIsIm1ldGVvcjovL/CfkrthcHAvY29sbGVjdGlvbnMvUG9zdC5qcyIsIm1ldGVvcjovL/CfkrthcHAvY29sbGVjdGlvbnMvUHJvZHVjdHNjb2xsLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9jb2xsZWN0aW9ucy9Vc2VyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9jb2xsZWN0aW9ucy9haWRlU29pZ25hbnRzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9jb2xsZWN0aW9ucy9hcnRpY2xlY29sbC5qcyIsIm1ldGVvcjovL/CfkrthcHAvY29sbGVjdGlvbnMvY2FydGNvbGwuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2NvbGxlY3Rpb25zL2RvY3VtZW50cy5qcyIsIm1ldGVvcjovL/CfkrthcHAvY29sbGVjdGlvbnMvZXRhYmxpc3NlbWVudHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2NvbGxlY3Rpb25zL2ZvdXJuaXNzZXVyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9jb2xsZWN0aW9ucy9tZXNJbWFnZXMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2NvbGxlY3Rpb25zL3Nob3Bjb2xsZWN0aW9uLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9jb2xsZWN0aW9ucy91c2VySGlzdG9yeS5qcyIsIm1ldGVvcjovL/CfkrthcHAvY29sbGVjdGlvbnMvdmlzaXRzLmpzIl0sIm5hbWVzIjpbIk1ldGVvciIsIm1ldGhvZHMiLCJwYXJzZVVwbG9hZCIsImRhdGEiLCJjaGVjayIsIkFycmF5IiwiaSIsImxlbmd0aCIsIml0ZW0iLCJleGlzdHMiLCJQcm9kdWN0ZGF0YSIsImZpbmRPbmUiLCJfaWQiLCJpZCIsImluc2VydCIsImNvbnNvbGUiLCJ3YXJuIiwicGFyc2VVcGxvYWRfcGhhcm0iLCJTaG9wIiwiYWRkQ29tbWVudCIsIm1lc3NhZ2UiLCJzaG9wSWQiLCJ1c2VyIiwiRXJyb3IiLCJDb21tZW50cyIsIk1lc3NhZ2UiLCJVc2VySWQiLCJBdXRob3IiLCJwcm9maWxlIiwibmFtZSIsInN1Ym1pdHRlZCIsIkRhdGUiLCJTaG9wSWQiLCJBdXRob3JQaWMiLCJhdmF0YXJfdXJsIiwiY29tbWVudElkIiwicmVtb3ZlIiwiYWxlcnQiLCJBbGVydCIsImRvYyIsInVzZXJJZCIsInRocm93RXJyb3IiLCJsb2ciLCJTY2hlbWFzIiwic2hvcCIsImVyciIsImRvY0lEIiwidXBkYXRlU2hvcERhdGEiLCJzaW1wbGVTY2hlbWEiLCJ1cGRhdGUiLCJ0b2FzdHIiLCJ3YXJuaW5nIiwidXB2b3RlIiwiU3RyaW5nIiwiXyIsImluY2x1ZGUiLCJ1cHZvdGVycyIsIiRhZGRUb1NldCIsIiRpbmMiLCJ2b3RlcyIsImV0YWJsaXNzZW1lbnQiLCJub20iLCJ0eXBlIiwicmVnaW9uIiwidmlsbGUiLCJxdWFydGllciIsIk1hdGNoIiwiTWF5YmUiLCJhZHJlc3NlIiwidGVsZXBob25lIiwiZW1haWwiLCJzaXRlV2ViIiwiRXRhYmxpc3NlbWVudHMiLCJkYXRlQWpvdXQiLCJjc3ZEYXRhIiwicGFyc2VkIiwiUGFwYSIsInBhcnNlIiwiaGVhZGVyIiwic2tpcEVtcHR5TGluZXMiLCJmb3JFYWNoIiwicm93IiwiYmFzZTY0RmlsZSIsImJpbmFyeSIsIkJ1ZmZlciIsImZyb20iLCJ3b3JrYm9vayIsIlhMU1giLCJyZWFkIiwic2hlZXROYW1lIiwiU2hlZXROYW1lcyIsInNoZWV0IiwiU2hlZXRzIiwianNvbiIsInV0aWxzIiwic2hlZXRfdG9fanNvbiIsImFqb3V0cHJvZHVpdCIsImJyYW5kIiwidGFnIiwicHJpY2UiLCJkZXNjIiwiY2F0ZWdvcnkiLCJvbnByZXNjIiwiZmlsZVNob3BJZCIsImltYWdlcyIsImFkZGVkQnkiLCJjcmVhdGVkQXQiLCJ1cGRhdGVkQXQiLCJwcm9kdWN0aWQiLCJwcm9kdWN0ZGF0YUlkIiwiYWRkU3R1ZmYiLCJhcnRpY2xlZGF0YSIsIkFydGljbGVzIiwiYXJ0aWNsZWRhdGFJZCIsIm1vZHVsZSIsIndhdGNoIiwicmVxdWlyZSIsInYiLCJIVFRQIiwic3RhcnR1cCIsImNvbW1hbmRlcllhbmdvIiwicGlja3VwIiwiZHJvcG9mZiIsImxhdCIsIk51bWJlciIsImxuZyIsImZha2VSZXNwb25zZSIsInN0YXR1cyIsImNhcl9hc3NpZ25lZCIsImV0YV9taW51dGVzIiwiZHJpdmVyX25hbWUiLCJjYXJfbW9kZWwiLCJ0cmFja2luZ191cmwiLCJham91dEFpZGVzb2lnbmFudCIsInByZW5vbSIsInNwZWNpYWxpdGUiLCJsb2NhbGlzYXRpb24iLCJkaXNwb25pYmxlIiwiZGVybmllckFwcGVsIiwiQWlkZVNvaWduYW50cyIsIkFpZGVTb2lnbmFudElkIiwiVXNlckhpc3RvcnkiLCJ2YWxpZFR5cGVzIiwiJHNldCIsImxhc3RVcGRhdGVkIiwidXBzZXJ0IiwiVmlzaXRzIiwidG9kYXkiLCJkYXRlT25seSIsImdldEZ1bGxZZWFyIiwiZ2V0TW9udGgiLCJnZXREYXRlIiwidmlzaXQiLCJkYXRlIiwiY291bnQiLCJkYXkiLCJ0b0lTT1N0cmluZyIsInNwbGl0IiwiV2ViQXBwIiwiY29ubmVjdEhhbmRsZXJzIiwidXNlIiwicmVxIiwicmVzIiwibmV4dCIsImZvcndhcmRlZEZvciIsImhlYWRlcnMiLCJpcCIsInRyaW0iLCJzb2NrZXQiLCJyZW1vdGVBZGRyZXNzIiwic2V0SG91cnMiLCJhbHJlYWR5VmlzaXRlZCIsIiRndGUiLCJwYXRoIiwidXJsIiwidXNlckFnZW50IiwiZXJyb3IiLCJzYXZlU3BlZWNoVGV4dCIsInRleHQiLCJzZWFyY2hQaGFybWFjeSIsImZpbmQiLCJmZXRjaCIsInNlYXJjaEhlYWx0aFBlcnNvbm5lbCIsInNlYXJjaEhlYWx0aEZhY2lsaXR5IiwiX2Vuc3VyZUluZGV4IiwicHVibGlzaCIsInVzZXJzIiwic29ydCIsImxpbWl0IiwicGFnZSIsInNraXAiLCJzZWFyY2giLCJzZWFyY2hEYXRhIiwicmFkaXVzIiwiY2VudGVyTGF0IiwibG9jYXRpb24iLCJjZW50ZXJMb24iLCJzZWxlY3RvciIsIiRuZWFyIiwiJGdlb21ldHJ5IiwiY29vcmRpbmF0ZXMiLCIkbWF4RGlzdGFuY2UiLCIkbWluRGlzdGFuY2UiLCJDYXJkc19vcGVuIiwiaWRjaWJsZSIsImFyZ3VtZW50IiwiSW1hZ2VzIiwic2VhcmNoVmFsdWUiLCJjdXJzb3IiLCIkdGV4dCIsIiRzZWFyY2giLCJmaWVsZHMiLCJzY29yZSIsIiRtZXRhIiwiaXNBZG1pbiIsIlJvbGVzIiwidXNlcklzSW5Sb2xlIiwiQ2FydCIsImZzcmxpc3QiLCJGb3Vybmlzc2V1cnMiLCJldGFibGlzc2VtZW50SWQiLCJmaWx0ZXJzIiwiT2JqZWN0IiwicXVlcnkiLCIkcmVnZXgiLCIkb3B0aW9ucyIsIkFjY291bnRzIiwiY3JlYXRlVXNlciIsInBhc3N3b3JkIiwibGFzdG5hbWUiLCJtb2JpbGUiLCJvY2N1cGF0aW9uIiwiYmlydGhkYXkiLCJvcmdhbml6YXRpb24iLCJ3ZWJzaXRlIiwiYmlvIiwiZ2VuZGVyIiwiYWRkVXNlcnNUb1JvbGVzIiwib25Mb2dpbiIsImRlZmF1bHRSb2xlIiwicm9sZXMiLCJ2YWxpZGF0ZUxvZ2luQXR0ZW1wdCIsImF0dGVtcHQiLCJhbGxvd2VkIiwicHJvY2VzcyIsImVudiIsIk1BSUxfVVJMIiwidG8iLCJjYyIsInN1YmplY3QiLCJyZXBseVRvIiwiZW1haWxEYXRhIiwidW5ibG9jayIsInJlYXNvbiIsIlNTUiIsImNvbXBpbGVUZW1wbGF0ZSIsIkFzc2V0cyIsImdldFRleHQiLCJFbWFpbCIsInNlbmQiLCJodG1sIiwicmVuZGVyIiwiYXR0YWNoZW1lbnRzIiwic2V0Um9sZU9uVXNlciIsIm9wdGlvbnMiLCJyb2xlIiwic2V0VXNlclJvbGVzIiwiZXhjZXB0aW9uIiwiaXNDbGllbnQiLCJTaW1wbGVDaGF0IiwiY29uZmlndXJlIiwidGV4dHMiLCJsb2FkTW9yZSIsInBsYWNlaG9sZGVyIiwiYnV0dG9uIiwiam9pbiIsImxlZnQiLCJyb29tIiwiYmVlcCIsInNob3dWaWV3ZWQiLCJzaG93UmVjZWl2ZWQiLCJzaG93Sm9pbmVkIiwicHVibGlzaENoYXRzIiwicm9vbUlkIiwiYWxsb3ciLCJ1c2VybmFtZSIsImF2YXRhciIsIm9uTmV3TWVzc2FnZSIsIm1zZyIsIm9uUmVjZWl2ZU1lc3NhZ2UiLCJvbkpvaW4iLCJvbkxlZnQiLCJQb3N0cyIsIk1vbmdvIiwiQ29sbGVjdGlvbiIsImZpZWxkTmFtZXMiLCJtb2RpZmllciIsInNjaGVtYSIsIlNpbXBsZVNjaGVtYSIsImxhYmVsIiwib3B0aW9uYWwiLCJkZWNpbWFsIiwiYXV0b2Zvcm0iLCJzdGVwIiwiQm9vbGVhbiIsImRlZmF1bHRWYWx1ZSIsImRvY3VtZW50c19wZXJzbyIsImFmRmllbGRJbnB1dCIsImNvbGxlY3Rpb24iLCJhY2NlcHQiLCJhdXRvVmFsdWUiLCJpc0luc2VydCIsImlzVXBkYXRlIiwiZGVueUluc2VydCIsImF0dGFjaFNjaGVtYSIsImFydGljbGVTdG9yZSIsIkZTIiwiU3RvcmUiLCJGaWxlU3lzdGVtIiwic3RvcmVzIiwiZG93bmxvYWQiLCJEb2N1bWVudHMiLCJTZWxlY3QiLCJhbGxvd2VkVmFsdWVzIiwicmVnRXgiLCJSZWdFeCIsIlVybCIsImVtYWlscyIsImFkcmVzcyIsImNsYXNzIiwicm93cyIsInVuc2V0Iiwib21pdCIsImxhc3RVcGRhdGUiLCJjcmVhdGVkQnkiLCJpbWFnZVN0b3JlIiwidGVhbU1iZXIiLCJOb20iLCJQcmVub20iLCJwaG90byIsIlBvc3RlIiwidmFsdWUiLCJzaG9waXRlbSIsInBpY3R1cmUiLCJBZGRyZXNzIiwibWluIiwibWF4Iiwic2hvcG5hbWUiLCJjdXN0b20iLCJ0b0xvd2VyQ2FzZSIsImZpZWxkIiwic2hvcG93bmVyIiwic2hvcGFkcmVzcyIsInNob3B0ZWwiLCJzaG9wbWFpbCIsInNob3Bsb2dvIiwidXBsb2FkUHJvZ3Jlc3NUZW1wbGF0ZSIsInNob3BzdHlsZSIsInNob3BzbG9nYW4iLCJnYXJkZSIsInNob3BUZWFtIiwic2hvcGl0ZW1zIiwiU2VhcmNoIiwiZXhwb3J0IiwiY2FsbGVkUGVyc29ubmVsIiwiY2FsbGVkRmFjaWxpdHkiLCJ2aXNpdGVkUGhhcm1hY3kiLCJzZWFyY2hlZERydWciLCJjb21wYXJlZFByaWNlcyIsIlZpc2l0c1NjaGVtYSIsIklQIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE07Ozs7Ozs7Ozs7O0FDTkFBLE9BQU9DLE9BQVAsQ0FBZTtBQUNiQyxjQUFhQyxJQUFiLEVBQW9CO0FBQ2xCQyxVQUFPRCxJQUFQLEVBQWFFLEtBQWI7O0FBRUEsU0FBTSxJQUFJQyxJQUFJLENBQWQsRUFBaUJBLElBQUlILEtBQUtJLE1BQTFCLEVBQWtDRCxHQUFsQyxFQUF3QztBQUN0QyxVQUFJRSxPQUFTTCxLQUFNRyxDQUFOLENBQWI7QUFBQSxVQUNJRyxTQUFTQyxZQUFZQyxPQUFaLENBQW9CO0FBQUNDLGFBQUlKLEtBQUtLO0FBQVYsT0FBcEIsQ0FEYjs7QUFHQSxVQUFJLENBQUNKLE1BQUwsRUFBYTtBQUNYQyxvQkFBWUksTUFBWixDQUFtQk4sSUFBbkI7QUFDRCxPQUZELE1BRU87QUFDTE8sZ0JBQVFDLElBQVIsQ0FBYyxxQ0FBZDtBQUNEO0FBQ0Y7QUFDRjs7QUFkWSxDQUFmLEU7Ozs7Ozs7Ozs7O0FDQUFoQixPQUFPQyxPQUFQLENBQWU7QUFDYmdCLG9CQUFtQmQsSUFBbkIsRUFBMEI7QUFDeEJDLFVBQU9ELElBQVAsRUFBYUUsS0FBYjs7QUFFQSxTQUFNLElBQUlDLElBQUksQ0FBZCxFQUFpQkEsSUFBSUgsS0FBS0ksTUFBMUIsRUFBa0NELEdBQWxDLEVBQXdDO0FBQ3RDLFVBQUlFLE9BQVNMLEtBQU1HLENBQU4sQ0FBYjtBQUFBLFVBQ0lHLFNBQVNTLEtBQUtQLE9BQUws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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0I7Ozs7Ozs7Ozs7O0FDNUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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SE4sR0FaOEI7QUFpQnBDN0gsYUFBVztBQUNUakgsVUFBTVQsTUFERztBQUVUc1AsV0FBTyxtQkFGRTtBQUdUQyxjQUFVO0FBSEQsR0FqQnlCO0FBc0JwQ2xKLFNBQU87QUFDTDVGLFVBQU04RCxNQUREO0FBRUwrSyxXQUFPLG1CQUZGO0FBR0xNLGtCQUFjLENBSFQ7QUFJTEwsY0FBVTtBQUpMLEdBdEI2QjtBQTRCcENqSixPQUFLO0FBQ0g3RixVQUFNVCxNQURIO0FBRUgrUSxXQUFPLHFCQUZKLENBRTBCOztBQUYxQjtBQTVCK0IsQ0FBakIsQ0FBckI7QUFrQ0FsTCxPQUFPd0ssWUFBUCxDQUFvQnVELFlBQXBCLEUiLCJmaWxlIjoiL2FwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIE1ldGVvci5QYXlwYWwuY29uZmlnKHtcclxuLy8gICAgICdob3N0JzonYXBpLnNhbmRib3gucGF5cGFsLmNvbScsXHJcbi8vICAgICAncG9ydCc6JycsXHJcbi8vICAgICAnY2xpZW50X2lkJzonQ2xpZW50SWQnLFxyXG4vLyAgICAgJ2NsaWVudF9zZWNyZXQnOidDbGllbnRTZWNyZXQnXHJcbi8vXHJcbi8vIH0pO1xyXG4iLCJNZXRlb3IubWV0aG9kcyh7XHJcbiAgcGFyc2VVcGxvYWQoIGRhdGEgKSB7XHJcbiAgICBjaGVjayggZGF0YSwgQXJyYXkgKTtcclxuXHJcbiAgICBmb3IgKCBsZXQgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrICkge1xyXG4gICAgICBsZXQgaXRlbSAgID0gZGF0YVsgaSBdLFxyXG4gICAgICAgICAgZXhpc3RzID0gUHJvZHVjdGRhdGEuZmluZE9uZSh7X2lkOml0ZW0uaWR9KTtcclxuXHJcbiAgICAgIGlmICghZXhpc3RzKSB7XHJcbiAgICAgICAgUHJvZHVjdGRhdGEuaW5zZXJ0KGl0ZW0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnNvbGUud2FybiggJ1JlamVjdGVkLiBUaGlzIGl0ZW0gYWxyZWFkeSBleGlzdHMuJyApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59KTtcclxuIiwiTWV0ZW9yLm1ldGhvZHMoe1xyXG4gIHBhcnNlVXBsb2FkX3BoYXJtKCBkYXRhICkge1xyXG4gICAgY2hlY2soIGRhdGEsIEFycmF5ICk7XHJcblxyXG4gICAgZm9yICggbGV0IGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKyApIHtcclxuICAgICAgbGV0IGl0ZW0gICA9IGRhdGFbIGkgXSxcclxuICAgICAgICAgIGV4aXN0cyA9IFNob3AuZmluZE9uZSh7X2lkOml0ZW0uaWR9KTtcclxuXHJcbiAgICAgIGlmICghZXhpc3RzKSB7XHJcbiAgICAgICAgU2hvcC5pbnNlcnQoaXRlbSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc29sZS53YXJuKCAnUmVqZWN0ZWQuIFRoaXMgcGhhcm1hY3kgYWxyZWFkeSBleGlzdHMuJyApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59KTtcclxuIiwiXHJcbk1ldGVvci5tZXRob2RzKHtcclxuICBhZGRDb21tZW50OiBmdW5jdGlvbihtZXNzYWdlLHNob3BJZCkge1xyXG4gICAgLy9nZXQgY3VycmVudCB1c2VyXHJcbiAgICB2YXIgdXNlciA9IE1ldGVvci51c2VyKCk7XHJcbiAgICAvL2NoZWNrIGlmIGxvZ2dlZCBpblxyXG4gICAgaWYgKCF1c2VyKXtcclxuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignWW91IG11c3QgYmUgbG9nZ2VkIGluIG9yZGVyIHRvIHN1Ym1pdCBhIGNvbW1lbnQhJyk7XHJcbiAgICB9XHJcbiAgICAvL2NoZWNrIG1lc3NhZ2UgY29udGVudCBpcyBub3QgZW1wdHlcclxuICAgIGlmICghbWVzc2FnZSl7XHJcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2ludmFsaWQtY29tbWVudCcsICdWb3VzIGRldmV6IHNhaXNpciBkdSB0ZXh0ZSAsY29tbWVudCBjYW4gbm90IGJlIGVtcHR5Jyk7XHJcbiAgICB9XHJcbiAgICBpZiAoIXNob3BJZCl7XHJcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ3Nob3AgSWQgdW5kZWZpbmVkJyk7XHJcbiAgICB9XHJcbiAgLy9TaG9wLnVwZGF0ZShjb21tZW50cy5zaG9wSWQsIHskaW5jOiB7Y29tbWVudHNDb3VudDogMX19KTtcclxuXHRDb21tZW50cy5pbnNlcnQoe1xyXG4gICBcdCAgTWVzc2FnZTptZXNzYWdlLFxyXG4gICBcdCAgVXNlcklkOiB1c2VyLl9pZCxcclxuICAgICAgQXV0aG9yOiB1c2VyLnByb2ZpbGUubmFtZSxcclxuICAgICAgc3VibWl0dGVkOiBuZXcgRGF0ZSgpLFxyXG4gICAgICBTaG9wSWQ6IHNob3BJZCxcclxuICAgICAgQXV0aG9yUGljOiB1c2VyLnByb2ZpbGUuYXZhdGFyX3VybCxcclxuXHJcbiAgICAgIC8vY29tbWVudHNDb3VudDogMFxyXG4gICAgfSk7XHJcbiAgfSxcclxuICAnZGVsZXRlQ29tbWVudCc6IGZ1bmN0aW9uIChjb21tZW50SWQpe1xyXG4gICAgLy9nZXQgY3VycmVudCB1c2VyXHJcbiAgICAgIHZhciB1c2VyID0gTWV0ZW9yLnVzZXIoKTtcclxuICAgICAgaWYoY29tbWVudElkKXtcclxuICAgICAgICBDb21tZW50cy5yZW1vdmUoY29tbWVudElkKTtcclxuICAgICAgICBhbGVydCgnY29tbWVudCBkZWxldGVkIGJ5Jyt1c2VyLnByb2ZpbGUubmFtZSApO1xyXG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuQWxlcnQoJ0NvbmZpcm0gdXIgYWN0aW9uJyk7XHJcbiAgICAgIH1cclxuXHJcblxyXG4gIH1cclxufSk7XHJcblxyXG4vKlxyXG5cclxuTWV0ZW9yLm1ldGhvZHMoe1xyXG4gICAgJ2FkZENvbW1lbnQnOmZ1bmN0aW9uKG1lc3NhZ2Usc2hvcElkKXtcclxuXHJcbiAgICBcdHZhciB1c2VyID0gTWV0ZW9yLnVzZXIoKTtcclxuICAgIFx0Ly9jaGVjayBpZiBsb2dnZWQgaW5cclxuXHQgICAgaWYgKCF1c2VyKXtcclxuXHQgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdZb3UgbXVzdCBiZSBsb2dnZWQgaW4gdG8gc3VibWl0ICBjb21tZW50IScpO1xyXG5cdCAgICB9XHJcbiAgICBcdGlmICghbWVzc2FnZSl7XHJcblx0ICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvciggJ1ZvdXMgZGV2ZXogc2Fpc2lyIGR1IHRleHRlICxjb21tZW50IGNhbiBub3QgYmUgZW1wdHknKTtcclxuXHQgICAgfVxyXG5cdFx0aWYgKCFzaG9wSWQpe1xyXG4gICAgICBcdCAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignc2hvcCBJZCB1bmRlZmluZWQnKTtcclxuICAgIFx0fVxyXG5cclxuXHRcdGNvbW1lbnQuVXNlcklkID0gdXNlci5faWQ7XHJcblx0XHRjb21tZW50Lk1lc3NhZ2UgPSBtZXNzYWdlO1xyXG5cdFx0Y29tbWVudC5TaG9wSWQgPSBzaG9wSWQ7XHJcblx0XHRjb21tZW50LkF1dGhvciA9IHVzZXIucHJvZmlsZS5uYW1lO1xyXG5cdFx0Y29tbWVudC5zdWJtaXR0ZWQgPSBuZXcgRGF0ZSgpO1xyXG5cclxuICAgICAgICBDb21tZW50cy5pbnNlcnQobWVzc2FnZSxzaG9wSWQsZnVuY3Rpb24oZXJyb3IscmVzdWx0KXtcclxuICAgICAgXHRpZihlcnJvcil7XHJcbiAgICAgIFx0XHRjb25zb2xlLmxvZyhcIm1lIHZvaWNpIGljaVwiKyBlcnJvcik7XHJcbiAgICAgIFx0XHR9XHJcbiAgICAgIFx0fSk7XHJcbiAgICB9XHJcblxyXG59KTtcclxuKi9cclxuXHJcbi8qXHJcbi8vY29tbWVudHNDb3VudDogMFxyXG4vL1Nob3AudXBkYXRlKGNvbW1lbnRzLnNob3BJZCwgeyRpbmM6IHtjb21tZW50c0NvdW50OiAxfX0pO1xyXG4gICAgLy8gdXNlcklkICYgc2hvcElkIGFyZSBvdXIgZm9yZWlnbiBrZXlcclxuKi9cclxuIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgYmFuZ3Qgb24gMDQvMDcvMjAxNi5cclxuICovXHJcblxyXG5cclxuTWV0ZW9yLm1ldGhvZHMoe1xyXG4gICAgJ2NyZWF0ZW5ld1BoYXJtJzogZnVuY3Rpb24oZG9jKSB7XHJcbiAgICAgIGlmICghdGhpcy51c2VySWQpIHtcclxuICAgICAgcmV0dXJuIHRocm93RXJyb3IoNDAzLCAnTXVzdCBiZSBsb2dnZWQgaW4nKTtcclxuICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiQWRkaW5nXCIsIGRvYyk7XHJcbiAgICAgICAgY2hlY2soZG9jLCBTY2hlbWFzLnNob3ApO1xyXG5cclxuICAgICAgICBTaG9wLmluc2VydChkb2MsIGZ1bmN0aW9uKGVyciwgX2lkKSB7Y29uc29sZS5sb2coXCJTaG9wSUQ6IFwiLCBkb2NJRCk7fSk7Ly9jYWxsYmFjayBlcnJvciBmdW5jdGlvblxyXG4gICAgfSxcclxuICAgIHVwZGF0ZVNob3BEYXRhOiBmdW5jdGlvbihkb2MsIGRvY0lEKSB7XHJcbiAgICAgIGlmICghdGhpcy51c2VySWQpIHtcclxuICAgICAgcmV0dXJuIHRocm93RXJyb3IoNDAzLCAnTXVzdCBiZSBsb2dnZWQgaW4nKTtcclxuICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLmxvZyhcIlVwZGF0aW5nXCIsIGRvYyk7XHJcbiAgICAgICAgY2hlY2soZG9jLCBTaG9wLnNpbXBsZVNjaGVtYSgpKTtcclxuICAgICAgICBTaG9wLnVwZGF0ZSh7X2lkOiBkb2NJRH0sIGRvYyk7XHJcbiAgICB9LFxyXG4gICAgJ2RlbGV0ZVNob3AnOiBmdW5jdGlvbiAoc2hvcElkKXtcclxuICAgICAgLy9nZXQgY3VycmVudCB1c2VyXHJcbiAgICAgICAgdmFyIHVzZXIgPSBNZXRlb3IudXNlcigpO1xyXG4gICAgICAgIGlmKCFzaG9wSWQpe1xyXG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignVGhpcyBwaGFybWFjeSBJZCBjYW4gbm90IGJlIGVtcHR5Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFNob3AucmVtb3ZlKHNob3BJZCk7XHJcbiAgICAgICAgdG9hc3RyLndhcm5pbmcoJ0Fub3RoZXIgcGhhcm1hY3kgZGVsZXRlZCBieScrdXNlci5wcm9maWxlLm5hbWUgKTtcclxuICAgIH0sXHJcbiAgICB1cHZvdGU6IGZ1bmN0aW9uKHNob3BJZCkge1xyXG4gICAgY2hlY2sodGhpcy51c2VySWQsIFN0cmluZyk7XHJcbiAgICBjaGVjayhzaG9wSWQsIFN0cmluZyk7XHJcbiAgICB2YXIgc2hvcCA9IFNob3AuZmluZE9uZShzaG9wSWQpO1xyXG4gICAgaWYgKCFzaG9wKVxyXG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdpbnZhbGlkJywgJ1Nob3Agbm90IGZvdW5kJyk7XHJcbiAgICBpZiAoXy5pbmNsdWRlKHNob3AudXB2b3RlcnMsIHRoaXMudXNlcklkKSlcclxuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignaW52YWxpZCcsICdBbHJlYWR5IHVwdm90ZWQgdGhpcyBzaG9wJyk7XHJcbiAgICBTaG9wLnVwZGF0ZShzaG9wLl9pZCwge1xyXG4gICAgICAkYWRkVG9TZXQ6IHt1cHZvdGVyczogdGhpcy51c2VySWR9LFxyXG4gICAgICAkaW5jOiB7dm90ZXM6IDF9XHJcbiAgICB9KTtcclxuICB9XHJcbn0pO1xyXG4iLCJNZXRlb3IubWV0aG9kcyh7XHJcbiAgICAnZXRhYmxpc3NlbWVudHMuaW5zZXJ0JzpmdW5jdGlvbiAoZXRhYmxpc3NlbWVudCkge1xyXG4gICAgICBjaGVjayhldGFibGlzc2VtZW50LCB7XHJcbiAgICAgICAgbm9tOiBTdHJpbmcsXHJcbiAgICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICAgIHJlZ2lvbjogU3RyaW5nLFxyXG4gICAgICAgIHZpbGxlOiBTdHJpbmcsXHJcbiAgICAgICAgcXVhcnRpZXI6IE1hdGNoLk1heWJlKFN0cmluZyksXHJcbiAgICAgICAgYWRyZXNzZTogTWF0Y2guTWF5YmUoU3RyaW5nKSxcclxuICAgICAgICB0ZWxlcGhvbmU6IE1hdGNoLk1heWJlKFN0cmluZyksXHJcbiAgICAgICAgZW1haWw6IE1hdGNoLk1heWJlKFN0cmluZyksXHJcbiAgICAgICAgc2l0ZVdlYjogTWF0Y2guTWF5YmUoU3RyaW5nKSxcclxuICAgICAgfSk7XHJcbiAgXHJcbiAgICAgIHJldHVybiBFdGFibGlzc2VtZW50cy5pbnNlcnQoe1xyXG4gICAgICAgIC4uLmV0YWJsaXNzZW1lbnQsXHJcbiAgICAgICAgZGF0ZUFqb3V0OiBuZXcgRGF0ZSgpLFxyXG4gICAgICB9KTtcclxuICAgIH0sXHJcbiAgXHJcbiAgICAnZXRhYmxpc3NlbWVudHMuaW1wb3J0Q1NWJzpmdW5jdGlvbihjc3ZEYXRhKSB7XHJcbiAgICAgIGNoZWNrKGNzdkRhdGEsIFN0cmluZyk7XHJcbiAgICAgIGNvbnN0IHBhcnNlZCA9IFBhcGEucGFyc2UoY3N2RGF0YSwge1xyXG4gICAgICAgIGhlYWRlcjogdHJ1ZSxcclxuICAgICAgICBza2lwRW1wdHlMaW5lczogdHJ1ZSxcclxuICAgICAgfSk7XHJcbiAgXHJcbiAgICAgIHBhcnNlZC5kYXRhLmZvckVhY2goKHJvdykgPT4ge1xyXG4gICAgICAgIGlmIChyb3cubm9tICYmIHJvdy50eXBlICYmIHJvdy5yZWdpb24gJiYgcm93LnZpbGxlKSB7XHJcbiAgICAgICAgICBFdGFibGlzc2VtZW50cy5pbnNlcnQoe1xyXG4gICAgICAgICAgICBub206IHJvdy5ub20sXHJcbiAgICAgICAgICAgIHR5cGU6IHJvdy50eXBlLFxyXG4gICAgICAgICAgICByZWdpb246IHJvdy5yZWdpb24sXHJcbiAgICAgICAgICAgIHZpbGxlOiByb3cudmlsbGUsXHJcbiAgICAgICAgICAgIHF1YXJ0aWVyOiByb3cucXVhcnRpZXIgfHwgJycsXHJcbiAgICAgICAgICAgIGFkcmVzc2U6IHJvdy5hZHJlc3NlIHx8ICcnLFxyXG4gICAgICAgICAgICB0ZWxlcGhvbmU6IHJvdy50ZWxlcGhvbmUgfHwgJycsXHJcbiAgICAgICAgICAgIGVtYWlsOiByb3cuZW1haWwgfHwgJycsXHJcbiAgICAgICAgICAgIHNpdGVXZWI6IHJvdy5zaXRlV2ViIHx8ICcnLFxyXG4gICAgICAgICAgICBkYXRlQWpvdXQ6IG5ldyBEYXRlKCksXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuICBcclxuICAgICdldGFibGlzc2VtZW50cy5pbXBvcnRYTFMnOmZ1bmN0aW9uIChiYXNlNjRGaWxlKSB7XHJcbiAgICAgIGNoZWNrKGJhc2U2NEZpbGUsIFN0cmluZyk7XHJcbiAgXHJcbiAgICAgIGNvbnN0IGJpbmFyeSA9IEJ1ZmZlci5mcm9tKGJhc2U2NEZpbGUsICdiYXNlNjQnKTtcclxuICAgICAgY29uc3Qgd29ya2Jvb2sgPSBYTFNYLnJlYWQoYmluYXJ5LCB7IHR5cGU6ICdidWZmZXInIH0pO1xyXG4gICAgICBjb25zdCBzaGVldE5hbWUgPSB3b3JrYm9vay5TaGVldE5hbWVzWzBdO1xyXG4gICAgICBjb25zdCBzaGVldCA9IHdvcmtib29rLlNoZWV0c1tzaGVldE5hbWVdO1xyXG4gICAgICBjb25zdCBqc29uID0gWExTWC51dGlscy5zaGVldF90b19qc29uKHNoZWV0KTtcclxuICBcclxuICAgICAganNvbi5mb3JFYWNoKChyb3cpID0+IHtcclxuICAgICAgICBpZiAocm93Lm5vbSAmJiByb3cudHlwZSAmJiByb3cucmVnaW9uICYmIHJvdy52aWxsZSkge1xyXG4gICAgICAgICAgRXRhYmxpc3NlbWVudHMuaW5zZXJ0KHtcclxuICAgICAgICAgICAgbm9tOiByb3cubm9tLFxyXG4gICAgICAgICAgICB0eXBlOiByb3cudHlwZSxcclxuICAgICAgICAgICAgcmVnaW9uOiByb3cucmVnaW9uLFxyXG4gICAgICAgICAgICB2aWxsZTogcm93LnZpbGxlLFxyXG4gICAgICAgICAgICBxdWFydGllcjogcm93LnF1YXJ0aWVyIHx8ICcnLFxyXG4gICAgICAgICAgICBhZHJlc3NlOiByb3cuYWRyZXNzZSB8fCAnJyxcclxuICAgICAgICAgICAgdGVsZXBob25lOiByb3cudGVsZXBob25lIHx8ICcnLFxyXG4gICAgICAgICAgICBlbWFpbDogcm93LmVtYWlsIHx8ICcnLFxyXG4gICAgICAgICAgICBzaXRlV2ViOiByb3cuc2l0ZVdlYiB8fCAnJyxcclxuICAgICAgICAgICAgZGF0ZUFqb3V0OiBuZXcgRGF0ZSgpLFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0sXHJcbiAgfSk7IiwiXHJcbk1ldGVvci5tZXRob2RzKHtcclxuICAgIGFqb3V0cHJvZHVpdDpmdW5jdGlvbihicmFuZCx0YWcscHJpY2UsZGVzYyxjYXRlZ29yeSxvbnByZXNjLGZpbGVTaG9wSWQsaW1hZ2VzLGFkZGVkQnksY3JlYXRlZEF0LHVwZGF0ZWRBdCkge1xyXG4gICAgICAgIHZhciB1c2VyID0gTWV0ZW9yLnVzZXIoKTtcclxuICAgICAgICAvL3ZhciBmaWxlU2hvcElkID0gdGVtcGxhdGUuZGF0YS5faWQ7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJBZGRpbmdcIiwgYnJhbmQsdGFnLHByaWNlLGRlc2MsY2F0ZWdvcnksb25wcmVzYyxpbWFnZXMsZmlsZVNob3BJZCxhZGRlZEJ5LGNyZWF0ZWRBdCx1cGRhdGVkQXQpO1xyXG4gICAgICAgIC8vY2hlY2soZG9jLCBTdHJpbmcpO1xyXG4gICAgICAgIC8vIE1ha2Ugc3VyZSB0aGUgdXNlciBpcyBsb2dnZWQgaW4gYmVmb3JlIGluc2VydGluZyBhIHRhc2tcclxuICAgICAgICAgICBpZiAoISB0aGlzLnVzZXJJZCkge1xyXG4gICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignbm90LWF1dGhvcml6ZWQnKTtcclxuICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBQcm9kdWN0ZGF0YS5pbnNlcnQoe2JyYW5kOmJyYW5kLHRhZzp0YWcsZGVzYzpkZXNjLGNhdGVnb3J5OmNhdGVnb3J5LG9ucHJlc2M6b25wcmVzYyxwcmljZTpwcmljZSxmaWxlU2hvcElkOmZpbGVTaG9wSWQsXHJcbiAgICAgICAgICAgICAgaW1hZ2VzOmltYWdlcyxcclxuICAgICAgICAgICAgICBhZGRlZEJ5OiB1c2VyLFxyXG4gICAgICAgICAgICAgIGNyZWF0ZWRBdDpuZXcgRGF0ZSgpLFxyXG5cclxuICAgICAgICAgICAgICB1cGRhdGVkQXQ6IG51bGx9KTtcclxuICAgICAgICAvLyAsIGZ1bmN0aW9uKGVyciwgZG9jSUQpIHtjb25zb2xlLmxvZyhcInByb2R1Y3RJRDogXCIsIGRvY0lELGVycik7fSk7Ly9jYWxsYmFjayBlcnJvciBmdW5jdGlvblxyXG4gICAgICB9LFxyXG4gICAgICAgICdkZWxldGVQcm9kdWN0ZGF0YSc6IGZ1bmN0aW9uIChwcm9kdWN0aWQpe1xyXG4gICAgICAgICAgLy9nZXQgY3VycmVudCB1c2VyXHJcbiAgICAgICAgICAgIHZhciB1c2VyID0gTWV0ZW9yLnVzZXIoKTtcclxuICAgICAgICAgICAgaWYoIXByb2R1Y3RpZCl7XHJcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignUHJvZHVjdGRhdGEgSWQgY2FuIG5vdCBiZSBlbXB0eScpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBQcm9kdWN0ZGF0YS5yZW1vdmUocHJvZHVjdGRhdGFJZCk7XHJcbiAgICAgICAgICAgIHRvYXN0ci53YXJuaW5nKCdTb21lIHByb2R1Y3QgZGVsZXRlZCBieScrdXNlci5wcm9maWxlLm5hbWUgKTtcclxuICAgICAgICB9XHJcbn0pO1xyXG5cclxuIiwiXHJcbk1ldGVvci5tZXRob2RzKHtcclxuICBhZGRTdHVmZjogZnVuY3Rpb24oZG9jKSB7XHJcbiAgICBpZiAoIXRoaXMudXNlcklkKSB7XHJcbiAgICAgIHJldHVybiB0aHJvd0Vycm9yKDQwMywgJ011c3QgYmUgbG9nZ2VkIGluJyk7XHJcbiAgICB9XHJcbiAgICBjb25zb2xlLmxvZyhcIkFkZGluZ1wiLCBkb2MpO1xyXG4gICAgY2hlY2soZG9jLCBTY2hlbWFzLmFydGljbGVkYXRhKTtcclxuXHJcbiAgQXJ0aWNsZXMuaW5zZXJ0KGRvYywgZnVuY3Rpb24oZXJyLCBkb2NJRCkge2NvbnNvbGUubG9nKFwic3R1ZmZJZDogXCIsIGRvY0lEKTt9KTsvL2NhbGxiYWNrIGVycm9yIGZ1bmN0aW9uXHJcblxyXG59LFxyXG4gICdkZWxldGVBcnRpY2xlZGF0YSc6IGZ1bmN0aW9uIChhcnRpY2xlZGF0YUlkKXtcclxuICAgIC8vZ2V0IGN1cnJlbnQgdXNlclxyXG4gICAgICB2YXIgdXNlciA9IE1ldGVvci51c2VyKCk7XHJcbiAgICAgIGlmKCFhcnRpY2xlZGF0YUlkKXtcclxuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdBcnRpY2xlcyBJZCBjYW4gbm90IGJlIGVtcHR5Jyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIEFydGljbGVzLnJlbW92ZShhcnRpY2xlZGF0YUlkKTtcclxuICAgICAgYWxlcnQoJ2NvbW1lbnQgZGVsZXRlZCBieScrdXNlci5wcm9maWxlLm5hbWUgKTtcclxuICB9XHJcbn0pO1xyXG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcclxuaW1wb3J0IHsgSFRUUCB9IGZyb20gJ21ldGVvci9odHRwJztcclxuaW1wb3J0IHsgY2hlY2sgfSBmcm9tICdtZXRlb3IvY2hlY2snO1xyXG5cclxuTWV0ZW9yLnN0YXJ0dXAoKCkgPT4ge1xyXG4gIC8vIGNvZGUgdG8gcnVuIG9uIHNlcnZlciBhdCBzdGFydHVwXHJcbn0pO1xyXG5cclxuTWV0ZW9yLm1ldGhvZHMoe1xyXG4gIGNvbW1hbmRlcllhbmdvKHBpY2t1cCwgZHJvcG9mZikge1xyXG4gICAgY2hlY2socGlja3VwLCB7IGxhdDogTnVtYmVyLCBsbmc6IE51bWJlciB9KTtcclxuICAgIGNoZWNrKGRyb3BvZmYsIHsgbGF0OiBOdW1iZXIsIGxuZzogTnVtYmVyIH0pO1xyXG5cclxuICAgIC8vIE1PQ0sgZGUgcsOpcG9uc2UgQVBJIFlhbmdvXHJcbiAgICBjb25zdCBmYWtlUmVzcG9uc2UgPSB7XHJcbiAgICAgIHN0YXR1czogJ29rJyxcclxuICAgICAgY2FyX2Fzc2lnbmVkOiB0cnVlLFxyXG4gICAgICBldGFfbWludXRlczogNSxcclxuICAgICAgZHJpdmVyX25hbWU6ICdKZWFuLVBhdWwnLFxyXG4gICAgICBjYXJfbW9kZWw6ICdUb3lvdGEgQ29yb2xsYScsXHJcbiAgICAgIHRyYWNraW5nX3VybDogJ2h0dHBzOi8veWFuZ28ubW9jay90cmFja2luZy8xMjM0NTYnXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBmYWtlUmVzcG9uc2U7XHJcbiAgfVxyXG59KTtcclxuLyogTWV0ZW9yLm1ldGhvZHMoe1xyXG4gIGNvbW1hbmRlcllhbmdvKHBpY2t1cCwgZHJvcG9mZikge1xyXG4gICAgY2hlY2socGlja3VwLCB7IGxhdDogTnVtYmVyLCBsbmc6IE51bWJlciB9KTtcclxuICAgIGNoZWNrKGRyb3BvZmYsIHsgbGF0OiBOdW1iZXIsIGxuZzogTnVtYmVyIH0pO1xyXG5cclxuICAgIGNvbnN0IGFwaUtleSA9IE1ldGVvci5zZXR0aW5ncy5wcml2YXRlLllBTkdPX0FQSV9LRVk7XHJcblxyXG4gICAgY29uc3QgZW5kcG9pbnQgPSBcImh0dHBzOi8vZmxlZXQtYXBpLnRheGkueWFuZGV4Lm5ldC92MS9wYXJrcy9vcmRlclwiOyAvLyDDoCBjb25maXJtZXIgc2Vsb24gdG9uIGFjY8Ooc1xyXG4gICAgY29uc3QgcGF5bG9hZCA9IHtcclxuICAgICAgc291cmNlOiB7XHJcbiAgICAgICAgbGF0aXR1ZGU6IHBpY2t1cC5sYXQsXHJcbiAgICAgICAgbG9uZ2l0dWRlOiBwaWNrdXAubG5nLFxyXG4gICAgICB9LFxyXG4gICAgICBkZXN0aW5hdGlvbjoge1xyXG4gICAgICAgIGxhdGl0dWRlOiBkcm9wb2ZmLmxhdCxcclxuICAgICAgICBsb25naXR1ZGU6IGRyb3BvZmYubG5nLFxyXG4gICAgICB9LFxyXG4gICAgICByZXF1aXJlbWVudHM6IHtcclxuICAgICAgICAvLyBvcHRpb25zIGRlIHRyYWpldCAoc2kgYmVzb2luKVxyXG4gICAgICB9LFxyXG4gICAgICAvLyBQZXV0IGluY2x1cmUgcGFya19pZCwgZHJpdmVyX3Byb2ZpbGVfaWQsIGV0Yy4sIHNlbG9uIHRvbiBjb250cmF0XHJcbiAgICB9O1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gSFRUUC5jYWxsKFwiUE9TVFwiLCBlbmRwb2ludCwge1xyXG4gICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgIFwiQXV0aG9yaXphdGlvblwiOiBgQmVhcmVyICR7YXBpS2V5fWAsXHJcbiAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRhdGE6IHBheWxvYWQsXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICBjb25zb2xlLmVycm9yKFwiRXJyZXVyIGNvbW1hbmRlIFlhbmdvOlwiLCBlcnJvcik7XHJcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCJ5YW5nby5lcnJvclwiLCBlcnJvci5tZXNzYWdlKTtcclxuICAgIH1cclxuICB9XHJcbn0pOyAqL1xyXG4iLCJNZXRlb3IubWV0aG9kcyh7XHJcbiAgICBham91dEFpZGVzb2lnbmFudDpmdW5jdGlvbihub20scHJlbm9tLHNwZWNpYWxpdGUsdGVsZXBob25lLGxvY2FsaXNhdGlvbixkaXNwb25pYmxlLGRlcm5pZXJBcHBlbCxhZGRlZEJ5LGNyZWF0ZWRBdCx1cGRhdGVkQXQpIHtcclxuICAgICAgICB2YXIgdXNlciA9IE1ldGVvci51c2VyKCk7XHJcbiAgICAgICAgLy92YXIgZmlsZVNob3BJZCA9IHRlbXBsYXRlLmRhdGEuX2lkO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiQWRkaW5nXCIsIG5vbSxwcmVub20sc3BlY2lhbGl0ZSx0ZWxlcGhvbmUsbG9jYWxpc2F0aW9uLGRpc3BvbmlibGUsZGVybmllckFwcGVsLGFkZGVkQnksY3JlYXRlZEF0LHVwZGF0ZWRBdCk7XHJcbiAgICAgICAgLy9jaGVjayhkb2MsIFN0cmluZyk7XHJcbiAgICAgICAgLy8gTWFrZSBzdXJlIHRoZSB1c2VyIGlzIGxvZ2dlZCBpbiBiZWZvcmUgaW5zZXJ0aW5nIGEgdGFza1xyXG4gICAgICAgICAgIGlmICghIHRoaXMudXNlcklkKSB7XHJcbiAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdub3QtYXV0aG9yaXplZCcpO1xyXG4gICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgQWlkZVNvaWduYW50cy5pbnNlcnQoe1xyXG4gICAgICAgICAgICAgIG5vbTpub20sXHJcbiAgICAgICAgICAgICAgcHJlbm9tOnByZW5vbSxcclxuICAgICAgICAgICAgICBzcGVjaWFsaXRlOnNwZWNpYWxpdGUsXHJcbiAgICAgICAgICAgICAgdGVsZXBob25lOnRlbGVwaG9uZSxcclxuICAgICAgICAgICAgICBsb2NhbGlzYXRpb246bG9jYWxpc2F0aW9uLFxyXG4gICAgICAgICAgICAgIGRpc3BvbmlibGU6ZGlzcG9uaWJsZSxcclxuICAgICAgICAgICAgICBkZXJuaWVyQXBwZWw6ZGVybmllckFwcGVsLFxyXG4gICAgICAgICAgICAgIGFkZGVkQnk6IHVzZXIsXHJcbiAgICAgICAgICAgICAgY3JlYXRlZEF0Om5ldyBEYXRlKCksXHJcblxyXG4gICAgICAgICAgICAgIHVwZGF0ZWRBdDogbnVsbH0pO1xyXG4gICAgICAgIC8vICwgZnVuY3Rpb24oZXJyLCBkb2NJRCkge2NvbnNvbGUubG9nKFwiQWlkZVNvaWduYW50SWQ6IFwiLCBkb2NJRCxlcnIpO30pOy8vY2FsbGJhY2sgZXJyb3IgZnVuY3Rpb25cclxuICAgICAgfSxcclxuICAgICAgICAnZGVsZXRlQWlkZXNvaWduYW50JzogZnVuY3Rpb24gKEFpZGVTb2lnbmFudElkKXtcclxuICAgICAgICAgIC8vZ2V0IGN1cnJlbnQgdXNlclxyXG4gICAgICAgICAgICB2YXIgdXNlciA9IE1ldGVvci51c2VyKCk7XHJcbiAgICAgICAgICAgIGlmKCFBaWRlU29pZ25hbnRJZCl7XHJcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignQWlkZVNvaWduYW50IElkICBjYW4gbm90IGJlIGVtcHR5Jyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIEFpZGVTb2lnbmFudHMucmVtb3ZlKEFpZGVTb2lnbmFudElkKTtcclxuICAgICAgICAgICAgdG9hc3RyLndhcm5pbmcoJ1NvbWUgcHJvZHVjdCBkZWxldGVkIGJ5Jyt1c2VyLnByb2ZpbGUubmFtZSApO1xyXG4gICAgICAgIH1cclxufSk7IiwiLy8gc2VydmVyL2ltYWdlcy5qc1xyXG4vLyB2YXIgaW1hZ2VTdG9yZSA9IG5ldyBGUy5TdG9yZS5TMyhcImltYWdlc1wiLCB7XHJcbi8vICAgICBhY2Nlc3NLZXlJZDogXCJ4eHh4XCIsXHJcbi8vICAgICBzZWNyZXRBY2Nlc3NLZXk6IFwieHh4eFwiLFxyXG4vLyAgICAgYnVja2V0OiBcInd3dy5teWJ1Y2tldC5jb21cIlxyXG4vLyB9KTtcclxuIiwiXHJcbi8qIGltcG9ydCBQREZEb2N1bWVudCBmcm9tICdwZGZraXQnO1xyXG5pbXBvcnQgeyBjcmVhdGVXcml0ZVN0cmVhbSB9IGZyb20gJ2ZzJztcclxuXHJcbk1ldGVvci5tZXRob2RzKHtcclxuICBjb252ZXJ0VG9QREYoaW1hZ2VQYXRoKSB7XHJcbiAgICBjb25zdCBwZGZQYXRoID0gYCR7cHJvY2Vzcy5lbnYuUFdEfS8ubWV0ZW9yL2xvY2FsL2J1aWxkL3Byb2dyYW1zL3NlcnZlci90bXAvZG9jXyR7RGF0ZS5ub3coKX0ucGRmYDtcclxuXHJcbiAgICBjb25zdCBkb2MgPSBuZXcgUERGRG9jdW1lbnQoKTtcclxuICAgIGRvYy5waXBlKGNyZWF0ZVdyaXRlU3RyZWFtKHBkZlBhdGgpKTtcclxuICAgIGRvYy5pbWFnZShpbWFnZVBhdGgsIDAsIDAsIHsgZml0OiBbNjAwLCA4MDBdIH0pO1xyXG4gICAgZG9jLmVuZCgpO1xyXG5cclxuICAgIHJldHVybiBwZGZQYXRoO1xyXG4gIH1cclxufSk7XHJcbiAqLyIsImltcG9ydCB7IFVzZXJIaXN0b3J5IH0gZnJvbSAnL2NvbGxlY3Rpb25zL3VzZXJIaXN0b3J5LmpzJztcclxuTWV0ZW9yLm1ldGhvZHMoe1xyXG4gICd1c2VySGlzdG9yeS5pbmNyZW1lbnQnKHVzZXJJZCwgdHlwZSkge1xyXG4gICAgY2hlY2sodXNlcklkLCBTdHJpbmcpO1xyXG4gICAgY2hlY2sodHlwZSwgU3RyaW5nKTtcclxuICAgIFxyXG4gICAgY29uc3QgdmFsaWRUeXBlcyA9IFsnY2FsbGVkUGVyc29ubmVsJywgJ2NhbGxlZEZhY2lsaXR5JywgJ3Zpc2l0ZWRQaGFybWFjeScsICdzZWFyY2hlZERydWcnLCAnY29tcGFyZWRQcmljZXMnXTtcclxuICAgIC8vaWYgKCF2YWxpZFR5cGVzLmluY2x1ZGVzKHR5cGUpKSB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdJbnZhbGlkIHR5cGUnKTtcclxuXHJcbiAgICBVc2VySGlzdG9yeS51cGRhdGUoXHJcbiAgICAgIHsgdXNlcklkIH0sXHJcbiAgICAgIHtcclxuICAgICAgICAkaW5jOiB7IFt0eXBlXTogMSB9LFxyXG4gICAgICAgICRzZXQ6IHsgbGFzdFVwZGF0ZWQ6IG5ldyBEYXRlKCkgfVxyXG4gICAgICB9LFxyXG4gICAgICB7IHVwc2VydDogdHJ1ZSB9XHJcbiAgICApO1xyXG4gIH1cclxufSk7XHJcblxyXG4iLCJpbXBvcnQgeyBWaXNpdHMgfSBmcm9tICcvY29sbGVjdGlvbnMvdmlzaXRzLmpzJztcclxuTWV0ZW9yLm1ldGhvZHMoe1xyXG4gICd2aXNpdHMudHJhY2snKCkge1xyXG4gICAgY29uc3QgdG9kYXkgPSBuZXcgRGF0ZSgpO1xyXG4gICAgY29uc3QgZGF0ZU9ubHkgPSBuZXcgRGF0ZSh0b2RheS5nZXRGdWxsWWVhcigpLCB0b2RheS5nZXRNb250aCgpLCB0b2RheS5nZXREYXRlKCkpO1xyXG4gICAgXHJcbiAgICBjb25zdCB2aXNpdCA9IFZpc2l0cy5maW5kT25lKHsgZGF0ZTogZGF0ZU9ubHl9KTtcclxuXHJcbiAgICBpZiAodmlzaXQpe1xyXG4gICAgICBWaXNpdHMudXBkYXRlKHZpc2l0Ll9pZCwgeyRpbmM6IHsgY291bnQ6IDF9fSk7XHJcbiAgICB9ZWxzZSB7XHJcbiAgICAgIFZpc2l0cy5pbnNlcnQoeyBkYXRlOiBkYXRlT25seSwgY291bnQ6IDF9KTtcclxuICAgIH1cclxuICB9XHJcbn0pO1xyXG5NZXRlb3IubWV0aG9kcyh7XHJcbiAgJ2xvZ1Zpc2l0JygpIHtcclxuICAgIGNvbnN0IHRvZGF5ID0gbmV3IERhdGUoKTtcclxuICAgIGNvbnN0IGRheSA9IHRvZGF5LnRvSVNPU3RyaW5nKCkuc3BsaXQoJ1QnKVswXTtcclxuXHJcbiAgICBWaXNpdHMudXBzZXJ0KFxyXG4gICAgICB7IGRheSB9LFxyXG4gICAgICB7ICRpbmM6IHsgY291bnQ6IDEgfSB9XHJcbiAgICApO1xyXG4gIH1cclxufSk7IiwiXHJcbmltcG9ydCB7IFZpc2l0cyB9IGZyb20gJy9jb2xsZWN0aW9ucy92aXNpdHMuanMnO1xyXG5pbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcclxuaW1wb3J0IHsgV2ViQXBwIH0gZnJvbSAnbWV0ZW9yL3dlYmFwcCc7XHJcblxyXG5cclxuTWV0ZW9yLnN0YXJ0dXAoKCkgPT4ge1xyXG4gIFdlYkFwcC5jb25uZWN0SGFuZGxlcnMudXNlKChyZXEsIHJlcywgbmV4dCkgPT4ge1xyXG4gICAgLy8gUsOpY3Vww6lyZXIgbCdhZHJlc3NlIElQICh4LWZvcndhcmRlZC1mb3IgcGV1dCBjb250ZW5pciBwbHVzaWV1cnMgSVAgc8OpcGFyw6llcyBwYXIgZGVzIHZpcmd1bGVzKVxyXG4gICAgY29uc3QgZm9yd2FyZGVkRm9yID0gcmVxLmhlYWRlcnNbJ3gtZm9yd2FyZGVkLWZvciddO1xyXG4gICAgY29uc3QgaXAgPSBmb3J3YXJkZWRGb3JcclxuICA/IGZvcndhcmRlZEZvci5zcGxpdCgnLCcpWzBdLnRyaW0oKVxyXG4gIDogKHJlcS5zb2NrZXQgJiYgcmVxLnNvY2tldC5yZW1vdGVBZGRyZXNzKTtcclxuICAgIC8vIETDqWZpbmlyIGxlIGTDqWJ1dCBkZSBsYSBqb3VybsOpZVxyXG4gICAgY29uc3QgdG9kYXkgPSBuZXcgRGF0ZSgpO1xyXG4gICAgdG9kYXkuc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcblxyXG4gICAgLy8gQ2hlcmNoZXIgdW5lIHZpc2l0ZSBleGlzdGFudGUgcG91ciBsYSBtw6ptZSBJUCBhdWpvdXJkJ2h1aVxyXG4gICAgY29uc3QgYWxyZWFkeVZpc2l0ZWQgPSBWaXNpdHMuZmluZE9uZSh7XHJcbiAgICAgIGlwLFxyXG4gICAgICBkYXRlOiB7ICRndGU6IHRvZGF5IH0sXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBFbnJlZ2lzdHJlbWVudCBzJ2lsIG4neSBhIHBhcyBlbmNvcmUgZGUgdmlzaXRlIGF1am91cmQnaHVpXHJcbiAgICBpZiAoIWFscmVhZHlWaXNpdGVkKSB7XHJcblxyXG4gICAgICB0cnkge1xyXG4gICAgICAgIFZpc2l0cy5pbnNlcnQoe1xyXG4gICAgICAgIGlwLFxyXG4gICAgICAgIGRhdGU6IG5ldyBEYXRlKCksXHJcbiAgICAgICAgcGF0aDogcmVxLnVybCxcclxuICAgICAgICB1c2VyQWdlbnQ6IHJlcS5oZWFkZXJzWyd1c2VyLWFnZW50J10sXHJcbiAgICAgIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKVxyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgfVxyXG4gICAvKiAgTWV0ZW9yLnNldEludGVydmFsKCgpID0+IHtcclxuICAgIGNvbnN0IHNldmVuRGF5c0FnbyA9IG5ldyBEYXRlKCk7XHJcbiAgICBzZXZlbkRheXNBZ28uc2V0RGF0ZShzZXZlbkRheXNBZ28uZ2V0RGF0ZSgpIC0gNyk7XHJcblxyXG4gICAgY29uc3QgcmVtb3ZlZENvdW50ID0gVmlzaXRzLnJlbW92ZSh7IGRhdGU6IHsgJGx0OiBzZXZlbkRheXNBZ28gfSB9KTtcclxuXHJcbiAgICBpZiAocmVtb3ZlZENvdW50ID4gMCkge1xyXG4gICAgICBjb25zb2xlLmxvZyhg4pyFIE5ldHRveWFnZSA6ICR7cmVtb3ZlZENvdW50fSB2aXNpdGVzIHN1cHByaW3DqWVzYCk7XHJcbiAgICB9XHJcbiAgfSwgMjQgKiA2MCAqIDYwICogMTAwMCk7IC8vIHRvdXMgbGVzIDI0aCAgKi9cclxuICAgIG5leHQoKTsgLy8gQ29udGludWVyIGxhIHJlcXXDqnRlXHJcbiAgfSk7XHJcbiAgXHJcbn0pO1xyXG4iLCJcclxuaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XHJcblxyXG5NZXRlb3IubWV0aG9kcyh7XHJcbiAgc2F2ZVNwZWVjaFRleHQodGV4dCkge1xyXG4gICAgY29uc29sZS5sb2coXCJUZXh0ZSByZWNvbm51IDpcIiwgdGV4dCk7XHJcbiAgICAvLyBJY2ksIHR1IHBldXggc3RvY2tlciBkYW5zIE1vbmdvREIgb3UgYW5hbHlzZXIgbGUgdGV4dGVcclxuICB9LFxyXG4gICBzZWFyY2hQaGFybWFjeSgpIHtcclxuICAgIGNvbnNvbGUubG9nKFwi8J+UjSBSZWNoZXJjaGUgZGUgcGhhcm1hY2llcy4uLlwiKTtcclxuICAgIC8vIEljaSB0dSBwZXV4IGxhbmNlciB1bmUgcmVjaGVyY2hlIGVuIGJhc2UgTW9uZ29EQlxyXG4gICAgcmV0dXJuIFNob3AuZmluZCgpLmZldGNoKCk7XHJcbiAgfSxcclxuICBzZWFyY2hIZWFsdGhQZXJzb25uZWwoKSB7XHJcbiAgICBjb25zb2xlLmxvZyhcIvCflI0gUmVjaGVyY2hlIGRlIHBlcnNvbm5lbHMgZGUgc2FudMOpLi4uXCIpO1xyXG4gICAgcmV0dXJuIEFpZGVTb2lnbmFudHMuZmluZCgpLmZldGNoKCk7XHJcbiAgfSxcclxuICBzZWFyY2hIZWFsdGhGYWNpbGl0eSgpIHtcclxuICAgIGNvbnNvbGUubG9nKFwi8J+UjSBSZWNoZXJjaGUgZGUgZm9ybWF0aW9ucyBzYW5pdGFpcmVzLi4uXCIpO1xyXG4gICAgcmV0dXJuIEV0YWJsaXNzZW1lbnRzLmZpbmQoKS5mZXRjaCgpO1xyXG4gIH0sXHJcbiAgLyogIHNlYXJjaFBoYXJtYWN5KGZpbHRlcnMpIHtcclxuICAgIGNvbnNvbGUubG9nKFwi8J+UjSBSZWNoZXJjaGUgcGhhcm1hY2llcyBhdmVjIGZpbHRyZXMgOlwiLCBmaWx0ZXJzKTtcclxuICAgIHJldHVybiBTaG9wLmZpbmQoZmlsdGVycykuZmV0Y2goKTtcclxuICB9LFxyXG4gIHNlYXJjaEhlYWx0aFBlcnNvbm5lbChmaWx0ZXJzKSB7XHJcbiAgICBjb25zb2xlLmxvZyhcIvCflI0gUmVjaGVyY2hlIHBlcnNvbm5lbHMgYXZlYyBmaWx0cmVzIDpcIiwgZmlsdGVycyk7XHJcbiAgICByZXR1cm4gQWlkZVNvaWduYW50cy5maW5kKGZpbHRlcnMpLmZldGNoKCk7XHJcbiAgfSxcclxuICBzZWFyY2hIZWFsdGhGYWNpbGl0eShmaWx0ZXJzKSB7XHJcbiAgICBjb25zb2xlLmxvZyhcIvCflI0gUmVjaGVyY2hlIGZvcm1hdGlvbnMgc2FuaXRhaXJlcyBhdmVjIGZpbHRyZXMgOlwiLCBmaWx0ZXJzKTtcclxuICAgIHJldHVybiBFdGFibGlzc2VtZW50cy5maW5kKGZpbHRlcnMpLmZldGNoKCk7XHJcbiAgfSxcclxuICBzZWFyY2hEcnVncygpIHtcclxuICAgIGNvbnNvbGUubG9nKFwi8J+UjSBSZWNoZXJjaGUgZGUgbWVkaWNhbWVudC4uLlwiKTtcclxuICAgIHJldHVybiBQcm9kdWN0ZGF0YS5maW5kKGZpbHRlcnMpLmZldGNoKCk7XHJcbiAgfSAqL1xyXG59KTtcclxuXHJcbk1ldGVvci5zdGFydHVwKCgpID0+IHtcclxuICBjb25zb2xlLmxvZyhcIlNlcnZldXIgTWV0ZW9yIGTDqW1hcnLDqSBhdmVjIHJlY29ubmFpc3NhbmNlIHZvY2FsZS5cIik7XHJcbn0pO1xyXG4iLCIvLyB2YXIgRlMgPSBOcG0ucmVxdWlyZSgnZnMnKTtcclxuLy9cclxuLy8gdmFyIGFydGljbGVTdG9yZSA9IG5ldyBGUy5TdG9yZS5TMyhcImFydGljbGVTdG9yZVwiLCB7XHJcbi8vICAgYWNjZXNzS2V5SWQ6IFwiYTBhMmUxNDNlYTEzYzQxMjJhYWU2NmQzOWNiYjY1MDE1MWRiXCIsXHJcbi8vICAgc2VjcmV0QWNjZXNzS2V5OiBcIjkxZmNlZTAzMDgzN2ZmMDk5ZGViMDdlZjc4ZDNcIixcclxuLy8gICBidWNrZXQ6IFwicXVpY2twaGFybWJ1Y2tldFwiLFxyXG4vLyAgIHRyYW5zZm9ybVdyaXRlOiBmdW5jdGlvbihmaWxlT2JqLCByZWFkU3RyZWFtLCB3cml0ZVN0cmVhbSkge1xyXG4vLyAgICAgZ20ocmVhZFN0cmVhbSwgZmlsZU9iai5uYW1lKCkpLnJlc2l6ZSgnMjUwJywgJzI1MCcpLnN0cmVhbSgpLnBpcGUod3JpdGVTdHJlYW0pXHJcbi8vICAgfVxyXG4vLyB9KVxyXG4vL1xyXG4vLyB2YXIgYXJ0aWNsZXNUaHVtYnMgPSBuZXcgRlMuU3RvcmUuUzMoXCJhcnRpY2xlc1RodW1ic1wiLCB7XHJcbi8vICAgYWNjZXNzS2V5SWQ6IFwiYTBhMmUxNDNlYTEzYzQxMjJhYWU2NmQzOWNiYjY1MDE1MWRiXCIsXHJcbi8vICAgc2VjcmV0QWNjZXNzS2V5OiBcIjkxZmNlZTAzMDgzN2ZmMDk5ZGViMDdlZjc4ZDNcIixcclxuLy8gICBidWNrZXQ6IFwiYXJ0aWNsZXRodW1ic2J1Y2tldFwiLFxyXG4vLyAgIGJlZm9yZVdyaXRlOiBmdW5jdGlvbihmaWxlT2JqKSB7XHJcbi8vICAgICBmaWxlT2JqLnNpemUoMjAsIHtzdG9yZTogXCJhcnRpY2xlc1RodW1ic1wiLCBzYXZlOiBmYWxzZX0pO1xyXG4vLyAgIH0sXHJcbi8vICAgdHJhbnNmb3JtV3JpdGU6IGZ1bmN0aW9uKGZpbGVPYmosIHJlYWRTdHJlYW0sIHdyaXRlU3RyZWFtKSB7XHJcbi8vICAgICBnbShyZWFkU3RyZWFtLCBmaWxlT2JqLm5hbWUoKSkucmVzaXplKCcyMCcsICcyMCcpLnN0cmVhbSgpLnBpcGUod3JpdGVTdHJlYW0pXHJcbi8vICAgfVxyXG4vLyB9KVxyXG4vL1xyXG4vL1xyXG4vLyBBcnRpY2xlcyA9IG5ldyBGUy5Db2xsZWN0aW9uKFwiYXJ0aWNsZXNcIiwge1xyXG4vLyAgIHN0b3JlczogW2FydGljbGVTdG9yZSwgYXJ0aWNsZXNUaHVtYnNdLFxyXG4vLyAgIGZpbHRlcjoge1xyXG4vLyAgICAgYWxsb3c6IHtcclxuLy8gICAgICAgY29udGVudFR5cGVzOiBbJ2ltYWdlLyonXVxyXG4vLyAgICAgfVxyXG4vLyAgIH1cclxuLy8gfSlcclxuIiwiaW1wb3J0IHsgVXNlckhpc3RvcnkgfSBmcm9tICcvY29sbGVjdGlvbnMvdXNlckhpc3RvcnkuanMnO1xyXG5pbXBvcnQgeyBWaXNpdHMgfSBmcm9tICcvY29sbGVjdGlvbnMvdmlzaXRzLmpzJztcclxuXHJcblxyXG5NZXRlb3Iuc3RhcnR1cCgoKSA9PiB7XHJcbiAgU2hvcC5fZW5zdXJlSW5kZXgoe1wibG9jYXRpb25cIjogXCIyZHNwaGVyZVwifSk7XHJcbn0pO1xyXG5cclxuTWV0ZW9yLnB1Ymxpc2goXCJuYXZiYXJcIixmdW5jdGlvbiAoKXtcclxuICAgICAgIE1ldGVvci51c2Vycy5maW5kT25lKHsgX2lkOiBNZXRlb3IudXNlcklkIH0pO1xyXG59KTtcclxuXHJcbk1ldGVvci5wdWJsaXNoKFwic2hvcGxpc3RcIixmdW5jdGlvbihzb3J0LGxpbWl0KXtcclxuICAgcmV0dXJuIFNob3AuZmluZCh7fSwge3NvcnQ6IHNvcnQsIGxpbWl0OiBsaW1pdH0pO1xyXG59KTtcclxuLy8gc2VydmVyL3B1YmxpY2F0aW9ucy5qc1xyXG5NZXRlb3IucHVibGlzaCgncGFnaW5hdGVkU2hvcHMnLCBmdW5jdGlvbiAocGFnZSwgbGltaXQpIHtcclxuICBjaGVjayhwYWdlLCBOdW1iZXIpO1xyXG4gIGNoZWNrKGxpbWl0LCBOdW1iZXIpO1xyXG5cclxuICBjb25zdCBza2lwID0gKHBhZ2UgLSAxKSAqIGxpbWl0O1xyXG4gIHJldHVybiBTaG9wLmZpbmQoe30sIHsgc2tpcCwgbGltaXQgfSk7XHJcbn0pO1xyXG5cclxuTWV0ZW9yLnB1Ymxpc2goJ3BhZ2luYXRlZERydWdzJywgZnVuY3Rpb24gKHBhZ2UsIGxpbWl0KSB7XHJcbiAgY2hlY2socGFnZSwgTnVtYmVyKTtcclxuICBjaGVjayhsaW1pdCwgTnVtYmVyKTtcclxuXHJcbiAgY29uc3Qgc2tpcCA9IChwYWdlIC0gMSkgKiBsaW1pdDtcclxuICByZXR1cm4gUHJvZHVjdGRhdGEuZmluZCh7fSwgeyBza2lwLCBsaW1pdCB9KTtcclxufSk7XHJcblxyXG5NZXRlb3IucHVibGlzaCgncGFnaW5hdGVkQXNzaXN0YW50JywgZnVuY3Rpb24gKHBhZ2UsIGxpbWl0KSB7XHJcbiAgY2hlY2socGFnZSwgTnVtYmVyKTtcclxuICBjaGVjayhsaW1pdCwgTnVtYmVyKTtcclxuXHJcbiAgY29uc3Qgc2tpcCA9IChwYWdlIC0gMSkgKiBsaW1pdDtcclxuICByZXR1cm4gQWlkZVNvaWduYW50cy5maW5kKHt9LCB7IHNraXAsIGxpbWl0IH0pO1xyXG59KTtcclxuXHJcbk1ldGVvci5wdWJsaXNoKFwic2hvcFwiLGZ1bmN0aW9uKHNlYXJjaCxzb3J0LCBsaW1pdCl7XHJcbiAgcmV0dXJuIFNob3AuZmluZChzZWFyY2gsIHtzb3J0OiBzb3J0LCBsaW1pdDogbGltaXR9KTtcclxufSk7XHJcblxyXG5NZXRlb3IucHVibGlzaChcInNob3BTZWFyY2hcIiwgZnVuY3Rpb24oc2VhcmNoRGF0YSkge1xyXG4gIGlmICghc2VhcmNoRGF0YSkge1xyXG4gICAgcmV0dXJuIFtdO1xyXG4gIH1cclxuXHJcbiAgdmFyIHJhZGl1cyA9IHNlYXJjaERhdGEucmFkaXVzO1xyXG4gIHZhciBjZW50ZXJMYXQgPSBzZWFyY2hEYXRhLmxvY2F0aW9uLmxhdDtcclxuICB2YXIgY2VudGVyTG9uID0gc2VhcmNoRGF0YS5sb2NhdGlvbi5sbmc7XHJcblxyXG4gIHZhciBzZWxlY3RvciA9IHtcclxuICAgIFwibG9jYXRpb24uZ2VvbWV0cnlcIjoge1xyXG4gICAgICAkbmVhcjoge1xyXG4gICAgICAgICRnZW9tZXRyeToge1xyXG4gICAgICAgICAgdHlwZTogXCJQb2ludFwiLFxyXG4gICAgICAgICAgY29vcmRpbmF0ZXM6IFtjZW50ZXJMb24sIGNlbnRlckxhdF1cclxuICAgICAgICB9LFxyXG4gICAgICAgICRtYXhEaXN0YW5jZTogcmFkaXVzICogMTAwMCxcclxuICAgICAgICAkbWluRGlzdGFuY2U6IDBcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHJldHVybiBTaG9wLmZpbmQoc2VsZWN0b3IpO1xyXG59KTtcclxuTWV0ZW9yLnB1Ymxpc2goXCJvcGVuXCIsZnVuY3Rpb24oKXtcclxucmV0dXJuIENhcmRzX29wZW4uZmluZCgpO1xyXG59KTtcclxuTWV0ZW9yLnB1Ymxpc2goXCJ1cGRhdGVzaG9wXCIsZnVuY3Rpb24oKXtcclxucmV0dXJuIFNob3AuZmluZCgpO1xyXG59KTtcclxuTWV0ZW9yLnB1Ymxpc2goXCJjb21tZW50c1wiLGZ1bmN0aW9uKCl7XHJcbnJldHVybiBDb21tZW50cy5maW5kKCk7XHJcbn0pO1xyXG4vKk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCl7Ki9cclxuICBNZXRlb3IucHVibGlzaChcInNob3dhcnRpY2xlXCIsZnVuY3Rpb24oc2hvcElkLyosc2tpcENvdW50Ki8pe1xyXG4gIHJldHVybiBBcnRpY2xlcy5maW5kKHtTaG9wSWQ6IHNob3BJZH0vKix7bGltaXQ6MTAsc2tpcDpza2lwQ291bnR9Ki8pXHJcbn0pO1xyXG5NZXRlb3IucHVibGlzaChcImFydGljbGVzdG9yZVwiLGZ1bmN0aW9uKHNob3BJZC8qLHNraXBDb3VudCovKXtcclxucmV0dXJuIEFydGljbGVzLmZpbmQoe1Nob3BJZDogc2hvcElkfS8qLHtsaW1pdDoxMCxza2lwOnNraXBDb3VudH0qLylcclxufSk7XHJcblxyXG5NZXRlb3IucHVibGlzaCgnc2hvcGluZm8nLGZ1bmN0aW9uKGlkY2libGUpIHtcclxuICAgIHJldHVybiBTaG9wLmZpbmRPbmUoaWRjaWJsZSk7XHJcbn0pO1xyXG4vLyBNZXRlb3IucHVibGlzaChcInByb2R1Y3RkYXRhXCIsZnVuY3Rpb24oKXtcclxuLy8gICByZXR1cm4gUHJvZHVjdGRhdGEuZmluZCgpO1xyXG4vLyB9KTtcclxuXHJcbk1ldGVvci5wdWJsaXNoKFwiaW1hZ2VzXCIsIGZ1bmN0aW9uIChhcmd1bWVudCkge1xyXG5hcmd1bWVudCA9IGFyZ3VtZW50IHx8IHt9O1xyXG5yZXR1cm4gSW1hZ2VzLmZpbmQoYXJndW1lbnQpO1xyXG59KTtcclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuTWV0ZW9yLnB1Ymxpc2goXCJzZWFyY2htZWRvY3NcIiwgZnVuY3Rpb24oc2VhcmNoVmFsdWUpIHtcclxuXHJcbiAgICBpZiAoIXNlYXJjaFZhbHVlKSB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgY29uc29sZS5sb2coXCJTZWFyY2hpbmcgZm9yIFwiLCBzZWFyY2hWYWx1ZSk7XHJcbiAgICB2YXIgY3Vyc29yID0gUHJvZHVjdGRhdGEuZmluZChcclxuICAgICAgeyAkdGV4dDogeyRzZWFyY2g6IHNlYXJjaFZhbHVlfSB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBgZmllbGRzYCBpcyB3aGVyZSB3ZSBjYW4gYWRkIE1vbmdvREIgcHJvamVjdGlvbnMuIEhlcmUgd2UncmUgY2F1c2luZ1xyXG4gICAgICAgICAqIGVhY2ggZG9jdW1lbnQgcHVibGlzaGVkIHRvIGluY2x1ZGUgYSBwcm9wZXJ0eSBuYW1lZCBgc2NvcmVgLCB3aGljaFxyXG4gICAgICAgICAqIGNvbnRhaW5zIHRoZSBkb2N1bWVudCdzIHNlYXJjaCByYW5rLCBhIG51bWVyaWNhbCB2YWx1ZSwgd2l0aCBtb3JlXHJcbiAgICAgICAgICogcmVsZXZhbnQgZG9jdW1lbnRzIGhhdmluZyBhIGhpZ2hlciBzY29yZS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBmaWVsZHM6IHtcclxuICAgICAgICAgIHNjb3JlOiB7ICRtZXRhOiBcInRleHRTY29yZVwiIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogVGhpcyBpbmRpY2F0ZXMgdGhhdCB3ZSB3aXNoIHRoZSBwdWJsaWNhdGlvbiB0byBiZSBzb3J0ZWQgYnkgdGhlXHJcbiAgICAgICAgICogYHNjb3JlYCBwcm9wZXJ0eSBzcGVjaWZpZWQgaW4gdGhlIHByb2plY3Rpb24gZmllbGRzIGFib3ZlLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHNvcnQ6IHtcclxuICAgICAgICAgIHNjb3JlOiB7ICRtZXRhOiBcInRleHRTY29yZVwiIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgKTtcclxuICAgIHJldHVybiBjdXJzb3I7XHJcbiAgfSk7XHJcbk1ldGVvci5wdWJsaXNoKG51bGwsZnVuY3Rpb24oKXtcclxuICByZXR1cm4gUHJvZHVjdGRhdGEuZmluZCh7fSk7XHJcbn0pO1xyXG4vKk1ldGVvci5wdWJsaXNoKFwidXNlckRhdGFcIiwgZnVuY3Rpb24gKCkge1xyXG4gIGlmIChNZXRlb3IudXNlcklkKCkpIHtcclxuICAgIHJldHVybiBNZXRlb3IudXNlcnMuZmluZCh7fSk7XHJcblxyXG4gIH0gZWxzZSB7XHJcbiAgICB0aGlzLnJlYWR5KCk7XHJcbiAgfVxyXG59KTsqL1xyXG5NZXRlb3IucHVibGlzaCggJ3VzZXJzJywgZnVuY3Rpb24oKSB7XHJcbiAgbGV0IGlzQWRtaW4gPSBSb2xlcy51c2VySXNJblJvbGUoIHRoaXMudXNlcklkLCAnYWRtaW4nICk7XHJcblxyXG4gIGlmICggaXNBZG1pbiApIHtcclxuICAgIHJldHVybiBbXHJcbiAgICAgIE1ldGVvci51c2Vycy5maW5kKCB7fSlcclxuXHJcbiAgICBdO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcbn0pO1xyXG5NZXRlb3IucHVibGlzaCgndXNlckRhdGEnLCBmdW5jdGlvbiAoKSB7IHJldHVybiBNZXRlb3IudXNlcnMuZmluZCh7fSwge2ZpZWxkczoge3Byb2ZpbGU6IDF9fSk7IH0pO1xyXG4vLyBNZXRlb3IucHVibGlzaCggJ3Byb2R1Y3RkYXRhJywgZnVuY3Rpb24oIHNlYXJjaCApIHtcclxuLy8gICAgIHJldHVybiBQcm9kdWN0ZGF0YS5maW5kKCBzZWFyY2gpO1xyXG4vLyB9KTtcclxuTWV0ZW9yLnB1Ymxpc2goJ2NhcnQnLGZ1bmN0aW9uKCl7XHJcbiAgICByZXR1cm4gQ2FydC5maW5kKCk7fSk7XHJcblxyXG5NZXRlb3IucHVibGlzaCgnZnNyTGlzdCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGZzcmxpc3QgPSBGb3Vybmlzc2V1cnMuZmluZCgpO1xyXG4gICAgcmV0dXJuIGZzcmxpc3QgfSk7XHJcblxyXG5cclxuXHJcbk1ldGVvci5wdWJsaXNoKCdhaWRlU29pZ25hbnRzJywgZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiBBaWRlU29pZ25hbnRzLmZpbmQoKTtcclxufSk7XHJcbk1ldGVvci5wdWJsaXNoKCdldGFibGlzc2VtZW50cy5hbGwnLCBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuIEV0YWJsaXNzZW1lbnRzLmZpbmQoKTtcclxufSk7XHJcblxyXG5NZXRlb3IucHVibGlzaCgnZXRhYmxpc3NlbWVudHMuYnlJZCcsIGZ1bmN0aW9uIChldGFibGlzc2VtZW50SWQpIHtcclxuICBjaGVjayhldGFibGlzc2VtZW50SWQsIFN0cmluZyk7XHJcbiAgcmV0dXJuIEV0YWJsaXNzZW1lbnRzLmZpbmQoeyBfaWQ6IGV0YWJsaXNzZW1lbnRJZCB9KTtcclxufSk7XHJcblxyXG5NZXRlb3IucHVibGlzaCgnZXRhYmxpc3NlbWVudHMuZmlsdGVyZWQnLCBmdW5jdGlvbiAoZmlsdGVycykge1xyXG4gIGNoZWNrKGZpbHRlcnMsIE9iamVjdCk7XHJcblxyXG4gIGNvbnN0IHF1ZXJ5ID0ge307XHJcblxyXG4gIGlmIChmaWx0ZXJzLnR5cGUpIHtcclxuICAgIHF1ZXJ5LnR5cGUgPSBmaWx0ZXJzLnR5cGU7XHJcbiAgfVxyXG4gIGlmIChmaWx0ZXJzLnJlZ2lvbikge1xyXG4gICAgcXVlcnkucmVnaW9uID0gZmlsdGVycy5yZWdpb247XHJcbiAgfVxyXG4gIGlmIChmaWx0ZXJzLnZpbGxlKSB7XHJcbiAgICBxdWVyeS52aWxsZSA9IGZpbHRlcnMudmlsbGU7XHJcbiAgfVxyXG4gIGlmIChmaWx0ZXJzLm5vbSkge1xyXG4gICAgcXVlcnkubm9tID0geyAkcmVnZXg6IGZpbHRlcnMubm9tLCAkb3B0aW9uczogJ2knIH07XHJcbiAgfVxyXG5cclxuICByZXR1cm4gRXRhYmxpc3NlbWVudHMuZmluZChxdWVyeSk7XHJcbn0pO1xyXG5NZXRlb3IucHVibGlzaCgndXNlckhpc3RvcnknLCBmdW5jdGlvbigpIHtcclxuICByZXR1cm4gVXNlckhpc3RvcnkuZmluZCh7IHVzZXJJZDogdGhpcy51c2VySWQgfSk7XHJcbn0pO1xyXG5NZXRlb3IucHVibGlzaCgndmlzaXRzLnRvZGF5JywgZnVuY3Rpb24gKCkge1xyXG4gIGNvbnN0IHRvZGF5ID0gbmV3IERhdGUoKTtcclxuICB0b2RheS5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuICByZXR1cm4gVmlzaXRzLmZpbmQoeyBkYXRlOiB7ICRndGU6IHRvZGF5IH0gfSk7XHJcbn0pO1xyXG5NZXRlb3IucHVibGlzaCgndmlzaXRzJywgZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiBWaXNpdHMuZmluZCgpO1xyXG59KTsiLCIvL2NyZWF0aW9uIGRlIGwnYWRtaW5pc3RyYXRldXIgc3lzdGVtZVxyXG5NZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcclxuXHRpZihNZXRlb3IudXNlcnMuZmluZCgpLmNvdW50KCkgPCAxKSB7XHJcblx0XHR2YXIgaWQgPSBBY2NvdW50cy5jcmVhdGVVc2VyKHtcclxuXHRcdFx0ZW1haWw6J2dpbGxlcy5ua291eWVlQGdtYWlsLmNvbScsXHJcblx0XHRcdHBhc3N3b3JkOidhZG1pbmFkbWluMjAxNCcsXHJcblx0XHRcdHByb2ZpbGU6e25hbWU6J0dpbGxlcy5BcnNlbmUnLFxyXG4gICAgICAgICAgICAgICAgYXZhdGFyX3VybDonL2FkNC5qcGcnLGxhc3RuYW1lOidOa291eWVcXCdlJyxtb2JpbGU6JzY5OTEwMzYxMS82ODEyMzg2MTEnLG9jY3VwYXRpb246J0RldmVsb3Blcicsc3RhdHVzOidXb3JrIGhhcmQgOyBQbGF5IGhhcmQgIScsYmlydGhkYXk6JzEwLzA0LzE5ODQnLFxyXG5cdFx0XHRcdFx0XHRcdG9yZ2FuaXphdGlvbjonJyx3ZWJzaXRlOicnLGJpbzonJyxnZW5kZXI6Jyd9XHJcblx0XHR9KTtcclxuXHJcblx0XHRSb2xlcy5hZGRVc2Vyc1RvUm9sZXMoaWQsJ2FkbWluJyk7XHJcblx0fVxyXG59KTtcclxuXHJcbi8vQXR0cmlidWUgbGUgcm9sZSAnZGVmYXVsdCcgYSB1biB1dGlsaXNhdGV1ciBxdWkgc2UgbG9ndWUgc2FucyBhdm9pciBkZWphIHVuIHJvbGUgZGVmaW5pIHBhciBsJ2FkbWluXHJcbkFjY291bnRzLm9uTG9naW4oZnVuY3Rpb24odXNlcikge1xyXG4gICAgICAgIHZhciB1c2VyID0gdXNlci51c2VyO1xyXG4gICAgICAgIHZhciBkZWZhdWx0Um9sZSA9IFsnYmFzaWMnXTtcclxuICAgICAgICBpZiAoIXVzZXIucm9sZXMpe1xyXG4gICAgICAgICAgICBSb2xlcy5hZGRVc2Vyc1RvUm9sZXModXNlciwgZGVmYXVsdFJvbGUpXHJcbiAgICAgICAgfTtcclxuICAgIH0pO1xyXG5BY2NvdW50cy52YWxpZGF0ZUxvZ2luQXR0ZW1wdChmdW5jdGlvbihhdHRlbXB0KSB7XHJcblx0XHRcdFx0ICBpZihSb2xlcy51c2VySXNJblJvbGUoYXR0ZW1wdC51c2VyLl9pZCwgWydpbmFjdGl2ZSddKSkge1xyXG5cdFx0XHRcdCAgICBhdHRlbXB0LmFsbG93ZWQgPSBmYWxzZTtcclxuXHRcdFx0XHQgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiVXNlciBhY2NvdW50IGlzIGluYWN0aXZlIVwiKTtcclxuXHRcdFx0XHQgIH1cclxuXHRcdFx0XHQgIHJldHVybiB0cnVlO1xyXG5cdFx0fSk7XHJcbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uICgpIHtcclxucHJvY2Vzcy5lbnYuTUFJTF9VUkwgPSAnc210cDovL2dpbGxlc25rb3V5ZUBnbWFpbC5jb206T2F0aG5pZWxASm5tbTIwMjRAc210cC5nbWFpbC5jb206NTg3Lyc7XHJcbn0pO1xyXG5cclxuTWV0ZW9yLm1ldGhvZHMoe1xyXG4gICdzZW5kRW1haWwnOiBmdW5jdGlvbiAodG8sY2MsZnJvbSwgc3ViamVjdCwgcmVwbHlUbyxlbWFpbERhdGEsZXJyb3IpIHtcclxuICAgLy9jaGVjayhbdG8sIGZyb20sIHN1YmplY3QscmVwbHlUbyxlbWFpbERhdGFdLCBbU3RyaW5nXSk7XHJcbiAgICBjb25zb2xlLmxvZyhcImFib3V0IHRvIHNlbmQgZW1haWwuLi5cIik7XHJcbiAgICB0aGlzLnVuYmxvY2soKTtcclxuXHJcbiAgICAgIGlmKGVycm9yKSB7Y29uc29sZS5sb2coXCJFcnJvcjogXCIgKyBlcnJvci5yZWFzb24pfTtcclxuICAgICAgU1NSLmNvbXBpbGVUZW1wbGF0ZSgnaHRtbEVtYWlsJywgQXNzZXRzLmdldFRleHQoJ2h0bWwtZW1haWwuaHRtbCcpKTtcclxuXHJcbiAgICAgICAgICBFbWFpbC5zZW5kKHtcclxuICAgICAgICAgICAgdG86IHRvLFxyXG4gICAgICAgICAgICBjYzogY2MsXHJcbiAgICAgICAgICAgIGZyb206IGZyb20sXHJcbiAgICAgICAgICAgIHN1YmplY3Q6IHN1YmplY3QsXHJcbiAgICAgICAgICAgIHJlcGx5VG86IHJlcGx5VG8sXHJcblxyXG4gICAgICAgICAgICBodG1sOiBTU1IucmVuZGVyKCdodG1sRW1haWwnLCBlbWFpbERhdGEpLFxyXG4gICAgICAgICAgICBhdHRhY2hlbWVudHM6W3t9XSxcclxuICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG59KTtcclxuLypNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbiAoKSB7XHJcbnRyeSB7XHJcbiAgdmFyIHJlc3VsdCA9IEFwcFdvcmtzaG9wLnNlbmRTTVMoJysyMzc2OTkxMDM2MTEnLCBcIkcnZGF5IE1PJyBQICEhXCIpO1xyXG4gIGNvbnNvbGUubG9nKFwicmVzdWx0OlwiKTtcclxuICBjb25zb2xlLmxvZyhyZXN1bHQpO1xyXG59IGNhdGNoIChlcnJvcikge1xyXG4gIGNvbnNvbGUubG9nKFwiZXJyb3I6XCIpO1xyXG4gIGNvbnNvbGUubG9nKGVycm9yKTtcclxufVxyXG59KTtcclxuTWV0ZW9yLm1ldGhvZHMoe1xyXG4gIHNlbmRTTVNGcm9tU2VydmVyOiBmdW5jdGlvbiAocmVjaXBpZW50KSB7XHJcbiAgICB2YXIgcmVzdWx0ID0gQXBwV29ya3Nob3Auc2VuZFNNUyhyZWNpcGllbnQsIFwiVGVzdCBTTVMhXCIpO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbn0pOyovXHJcbiIsIlxyXG4gIE1ldGVvci5zdGFydHVwKGZ1bmN0aW9uICgpIHtcclxuICAgIFByb2R1Y3RkYXRhLl9lbnN1cmVJbmRleCh7XHJcbiAgICAgIFwiYnJhbmRcIjogXCJ0ZXh0XCJcclxuICAgIH0pO1xyXG4gICAgLy8gc2VlZCgpO1xyXG4gICAgLy8gaWYgKCFkb2N1bWVudC5jb29raWUubWF0Y2goXCJzZWFyY2hyZXN1bHRzPVwiKSlcclxuICAgIC8vICAgJCgnYm9keScpLmFwcGVuZChNZXRlb3IudWkucmVuZGVyKFRlbXBsYXRlLnNlYXJjaHJlc3VsdHMpKTsgICBcclxuICB9KTtcclxuIiwiTWV0ZW9yLm1ldGhvZHMoe1xyXG4gIHNldFJvbGVPblVzZXIoIG9wdGlvbnMgKSB7XHJcbiAgICBjaGVjayggb3B0aW9ucywge1xyXG4gICAgICB1c2VyOiBTdHJpbmcsXHJcbiAgICAgIHJvbGU6IFN0cmluZ1xyXG4gICAgfSk7XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgUm9sZXMuc2V0VXNlclJvbGVzKCBvcHRpb25zLnVzZXIsIFsgb3B0aW9ucy5yb2xlIF0gKTtcclxuICAgIH0gY2F0Y2goIGV4Y2VwdGlvbiApIHtcclxuICAgICAgcmV0dXJuIGV4Y2VwdGlvbjtcclxuICAgIH1cclxuICB9XHJcbn0pO1xyXG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcclxuXHJcbmlmKE1ldGVvci5pc0NsaWVudCl7XHJcbiAgU2ltcGxlQ2hhdC5jb25maWd1cmUgKHtcclxuICAgIHRleHRzOntcclxuICAgICAgICBsb2FkTW9yZTogJ0xvYWQgTW9yZScsXHJcbiAgICAgICAgcGxhY2Vob2xkZXI6ICdUeXBlIG1lc3NhZ2UgLi4uJyxcclxuICAgICAgICBidXR0b246ICdzZW5kJyxcclxuICAgICAgICBqb2luOiAnSm9pbiB0bycsXHJcbiAgICAgICAgbGVmdDogJ0xlZnQgdGhlJyxcclxuICAgICAgICByb29tOiAncm9vbSBhdCdcclxuICAgIH0sXHJcbiAgICBsaW1pdDogNSxcclxuICAgICAgICBiZWVwOiB0cnVlLFxyXG4gICAgICAgIHNob3dWaWV3ZWQ6IHRydWUsXHJcbiAgICAgICAgc2hvd1JlY2VpdmVkOiB0cnVlLFxyXG4gICAgICAgIHNob3dKb2luZWQ6IHRydWUsXHJcbiAgICAgICAgcHVibGlzaENoYXRzOiBmdW5jdGlvbihyb29tSWQsIGxpbWl0KXsgLy9zZXJ2ZXJcclxuICAgICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIGFsbG93OiBmdW5jdGlvbihtZXNzYWdlLCByb29tSWQsIHVzZXJuYW1lLCBhdmF0YXIsIG5hbWUpe1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb25OZXdNZXNzYWdlOmZ1bmN0aW9uKG1zZyl7ICAvL2JvdGhcclxuICAgICAgICB9LFxyXG4gICAgICAgIG9uUmVjZWl2ZU1lc3NhZ2U6ZnVuY3Rpb24oaWQsIG1lc3NhZ2UsIHJvb20peyAvL3NlcnZlclxyXG5cclxuICAgICAgICB9LFxyXG4gICAgICAgIG9uSm9pbjpmdW5jdGlvbihyb29tSWQsIHVzZXJuYW1lLCBuYW1lLGRhdGUpeyAgLy9zZXJ2ZXJcclxuICAgICAgICB9LFxyXG4gICAgICAgIG9uTGVmdDpmdW5jdGlvbihyb29tSWQsIHVzZXJuYW1lLCBuYW1lLGRhdGUpIHsgLy9zZXJ2ZXJcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59XHJcbiIsIi8vIGluIC9saWIgbmVlZGVkIG9uIGJvdGggY2xpZW50IGFuZCBzZXJ2ZXJcclxuXHJcbi8vIHZhciB0aHJvd0Vycm9yID0gZnVuY3Rpb24oZXJyb3IsIHJlYXNvbiwgZGV0YWlscykge1xyXG4vLyAgIGVycm9yID0gbmV3IE1ldGVvci5FcnJvcihlcnJvciwgcmVhc29uLCBkZXRhaWxzKTtcclxuLy8gICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XHJcbi8vICAgICByZXR1cm4gZXJyb3I7XHJcbi8vICAgfSBlbHNlIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcclxuLy8gICAgIHRocm93IGVycm9yO1xyXG4vLyAgIH1cclxuLy8gfTtcclxuIiwiUG9zdHMgPSBuZXcgTW9uZ28uQ29sbGVjdGlvbigncG9zdHMnKTtcclxuLy8gU2NoZW1hcyA9IHt9O1xyXG5Qb3N0cy5hbGxvdyh7XHJcblxyXG5pbnNlcnQgOiBmdW5jdGlvbih1c2VySWQsZG9jKXtcclxucmV0dXJuIHRydWU7XHJcbn0sXHJcbnVwZGF0ZSA6IGZ1bmN0aW9uKHVzZXJJZCxkb2MsZmllbGROYW1lcyxtb2RpZmllcil7XHJcbnJldHVybiB0cnVlO1xyXG59LFxyXG5yZW1vdmUgOiBmdW5jdGlvbih1c2VySWQsZG9jKXtcclxucmV0dXJuIHRydWU7XHJcbn0sXHJcbiAgZmV0Y2g6IFsnb3duZXInXVxyXG59KTtcclxuIiwiUHJvZHVjdGRhdGEgPSBuZXcgTW9uZ28uQ29sbGVjdGlvbigncHJvZHVjdGRhdGEnKTtcclxuIFxyXG5Qcm9kdWN0ZGF0YS5hbGxvdyh7XHJcblxyXG5pbnNlcnQgOiBmdW5jdGlvbih1c2VySWQsZG9jKXtcclxucmV0dXJuIHRydWU7XHJcbn0sXHJcbnVwZGF0ZSA6IGZ1bmN0aW9uKHVzZXJJZCxkb2MsZmllbGROYW1lcyxtb2RpZmllcil7XHJcbnJldHVybiB0cnVlO1xyXG59LFxyXG5yZW1vdmUgOiBmdW5jdGlvbih1c2VySWQsZG9jKXtcclxucmV0dXJuIHRydWU7XHJcbn0sXHJcbiAgZmV0Y2g6IFsnb3duZXInXVxyXG59KTtcclxuLy8gIFByb2R1Y3RkYXRhLmF0dGFjaFNjaGVtYSAoIG5ldyBTaW1wbGVTY2hlbWEoe1xyXG4vLyAgICAgICBwcmljZTp7XHJcbi8vICAgICAgICAgdHlwZTogTnVtYmVyLFxyXG4vLyAgICAgICAgIGxhYmVsOlwiUHJpY2VcIlxyXG4vLyAgICAgICB9LFxyXG4vLyAgICAgICB0YWcgOntcclxuLy8gICBcdFx0XHRcdHR5cGU6IFN0cmluZyxcclxuLy8gICBcdFx0XHRcdGxhYmVsOlwiVGFnXCIsXHJcbi8vICAgXHRcdFx0XHRhbGxvd2VkVmFsdWVzOiBbJ05vdXJyaXNzb25zJywgJ0VuZmFudHMnLCAnQWR1bHRlcyddLFxyXG4vLyAgIFx0XHRcdCAgICBhdXRvZm9ybToge1xyXG4vLyAgIFx0XHRcdCAgICAgIG9wdGlvbnM6IFtcclxuLy8gICBcdFx0XHQgICAgICAgIHtsYWJlbDogXCJOb3Vycmlzc29uc1wiLCB2YWx1ZTogXCJOb3Vycmlzc29uc1wifSxcclxuLy8gICBcdFx0XHQgICAgICAgIHtsYWJlbDogXCJFbmZhbnRzXCIsIHZhbHVlOiBcIkVuZmFudHNcIn0sXHJcbi8vICAgXHRcdFx0ICAgICAgICB7bGFiZWw6IFwiQWR1bHRlc1wiLCB2YWx1ZTogXCJBZHVsdGVzXCJ9XHJcbi8vXHJcbi8vICAgXHRcdFx0ICAgICAgXVxyXG4vLyAgIFx0XHRcdCAgICB9XHJcbi8vICAgXHRcdFx0fSxcclxuLy8gICAgICAgYnJhbmQ6e1xyXG4vLyAgICAgICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxyXG4vLyAgICAgICAgICAgICAgICAgbGFiZWw6XCJCcmFuZFwiLFxyXG4vLyAgICAgICAgICAgICAgICAgbWF4OiAyNTBcclxuLy8gICAgICAgICAgICAgICB9LFxyXG4vL1xyXG4vLyAgICAgICBpbWFnZXM6IHtcclxuLy8gICAgICAgICAgIHR5cGU6IFN0cmluZyxcclxuLy8gICAgICAgICAgIGxhYmVsOlwiaW1hZ2VzXCIsXHJcbi8vICAgICAgICAgICBhdXRvZm9ybToge1xyXG4vLyAgICAgICAgICAgICBhZkZpZWxkSW5wdXQ6IHtcclxuLy8gICAgICAgICAgICAgICB0eXBlOiBcImNmcy1maWxlXCIsXHJcbi8vICAgICAgICAgICAgICAgY29sbGVjdGlvbjogJ2FydGljbGVzJyxcclxuLy8gICAgICAgICAgICAgICB1cGxvYWRQcm9ncmVzc1RlbXBsYXRlOidMb2FkaW5nJ1xyXG4vLyAgICAgICAgICAgICB9XHJcbi8vICAgICAgICAgfVxyXG4vLyAgICAgIH0sXHJcbi8vICAgICAgZGVzY3JpcHRpb24gOntcclxuLy8gICAgXHRcdFx0XHR0eXBlOiBTdHJpbmcsXHJcbi8vICAgIFx0XHRcdFx0bGFiZWw6XCJEZXNjcmlwdGlvblwiLFxyXG4vLyAgICBcdFx0XHRcdGF1dG9mb3JtOntcclxuLy8gICAgXHRcdFx0XHRcdHBsYWNlaG9sZGVyOiAnU2hvcnQgKGxlc3MgdGhhbiAxMDAgY2hhcmFjdGVycyknLFxyXG4vLyAgICAgICAgICBcdFx0XHRcdHJvd3M6IDNcclxuLy8gICAgXHRcdFx0XHR9XHJcbi8vICAgIFx0XHRcdH0sXHJcbi8vICAgICAgICAgY2xhc3NlIDp7XHJcbi8vICAgICAgIFx0XHRcdFx0dHlwZTogU3RyaW5nLFxyXG4vLyAgICAgICBcdFx0XHRcdGxhYmVsOlwiQ2xhc3NlXCIsXHJcbi8vICAgICAgICAgICAgICAgYWxsb3dlZFZhbHVlczogWydBbnRpYmlvdGlxdWUnLCAnQW50aWZvbmdpcXVlJywgJ0RpLWFudGFsZ2lxdWUnXSxcclxuLy8gICAgICAgXHRcdFx0ICAgIGF1dG9mb3JtOiB7XHJcbi8vICAgICAgIFx0XHRcdCAgICAgIG9wdGlvbnM6IFtcclxuLy8gICAgICAgXHRcdFx0ICAgICAgICB7bGFiZWw6IFwiQW50aWJpb3RpcXVlXCIsIHZhbHVlOiBcIkFudGliaW90aXF1ZVwifSxcclxuLy8gICAgICAgXHRcdFx0ICAgICAgICB7bGFiZWw6IFwiQW50aWZvbmdpcXVlXCIsIHZhbHVlOiBcIkFudGlmb25naXF1ZVwifSxcclxuLy8gICAgICAgXHRcdFx0ICAgICAgICB7bGFiZWw6IFwiRGktYW50YWxnaXF1ZVwiLCB2YWx1ZTogXCJEaS1hbnRhbGdpcXVlXCJ9XHJcbi8vXHJcbi8vICAgICAgIFx0XHRcdCAgICAgIF1cclxuLy8gICAgICAgXHRcdFx0ICAgIH1cclxuLy8gICAgICAgXHRcdFx0fSxcclxuLy8gICAgXHRhZGRlZEJ5OiB7XHJcbi8vICAgIFx0XHRcdFx0dHlwZTogU3RyaW5nLFxyXG4vLyAgICBcdFx0XHRcdGxhYmVsOiBcIkNyZWF0ZWQgQnlcIixcclxuLy8gICAgXHRcdFx0XHRhdXRvVmFsdWU6IGZ1bmN0aW9uKCkge1xyXG4vLyAgICBcdFx0XHRcdGlmICh0aGlzLmlzSW5zZXJ0KSB7XHJcbi8vICAgIFx0XHRcdFx0cmV0dXJuIHRoaXMudXNlcjtcclxuLy8gICAgXHRcdFx0fVxyXG4vLyAgICBcdFx0fSxcclxuLy8gICAgXHRcdGF1dG9mb3JtOiB7XHJcbi8vICAgIFx0XHRcdFx0dHlwZTpcImhpZGRlblwiXHJcbi8vICAgIFx0XHRcdH1cclxuLy8gICAgXHR9LFxyXG4vLyAgICBcdGNyZWF0ZWRBdDoge1xyXG4vLyAgICBcdFx0XHRcdHR5cGU6IERhdGUsXHJcbi8vICAgIFx0XHRcdFx0bGFiZWw6IFwiQ3JlYXRlZCBBdFwiLFxyXG4vLyAgICBcdFx0XHRcdGF1dG9WYWx1ZTogZnVuY3Rpb24oKSB7XHJcbi8vICAgIFx0XHRcdFx0aWYgKHRoaXMuaXNJbnNlcnQpIHtcclxuLy8gICAgXHRcdFx0XHRyZXR1cm4gbmV3IERhdGU7XHJcbi8vICAgIFx0XHRcdH1cclxuLy8gICAgXHRcdH0sXHJcbi8vICAgIFx0XHRhdXRvZm9ybToge1xyXG4vLyAgICBcdFx0XHRcdHR5cGU6XCJoaWRkZW5cIlxyXG4vLyAgICBcdFx0XHR9XHJcbi8vICAgIFx0fSxcclxuLy8gICAgXHR1cGRhdGVkQXQ6IHtcclxuLy8gICAgXHRcdFx0XHR0eXBlOiBEYXRlLFxyXG4vLyAgICBcdFx0XHRcdGxhYmVsOiBcIlVwZGF0ZWQgQXRcIixcclxuLy8gICAgXHRcdFx0XHRhdXRvVmFsdWU6IGZ1bmN0aW9uKCkge1xyXG4vLyAgICBcdFx0XHRcdGlmICh0aGlzLmlzVXBkYXRlKSB7XHJcbi8vICAgIFx0XHRcdFx0cmV0dXJuIG5ldyBEYXRlKCk7XHJcbi8vICAgIFx0XHRcdH1cclxuLy8gICAgXHRcdH0sXHJcbi8vICAgIFx0XHRcdGF1dG9mb3JtOiB7XHJcbi8vICAgIFx0XHRcdFx0dHlwZTpcImhpZGRlblwiXHJcbi8vICAgIFx0XHRcdH0sXHJcbi8vICAgIFx0XHRcdGRlbnlJbnNlcnQ6IHRydWUsXHJcbi8vICAgIFx0XHRcdG9wdGlvbmFsOiB0cnVlXHJcbi8vICAgIFx0fSxcclxuLy9cclxuLy8gICAgIGZpbGVTaG9wSWQ6IHtcclxuLy8gICAgICAgICB0eXBlOiBTdHJpbmcsXHJcbi8vICAgICAgICAgbGFiZWw6XCJmaWxlU2hvcElkXCIsXHJcbi8vICAgICAgICAgICAgIGF1dG9WYWx1ZTogZnVuY3Rpb24oKSB7XHJcbi8vICAgICAgICAgICAgIGlmICh0aGlzLmlzSW5zZXJ0KSB7XHJcbi8vICAgICAgICAgICAgIHJldHVybiB0aGlzLl9pZDtcclxuLy8gICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgIGF1dG9mb3JtOiB7XHJcbi8vICAgICBcdFx0XHRcdHR5cGU6XCJoaWRkZW5cIlxyXG4vLyAgICAgXHRcdFx0fVxyXG4vLyAgICAgICAgIH1cclxuLy8gICAgICAgfVxyXG4vLyB9KSk7XHJcbi8vIFByb2R1Y3RkYXRhLmF0dGFjaFNjaGVtYShTY2hlbWFzLnByb2R1Y3RkYXRhKTtcclxuLy8gcHJvZHVjdGRhdGEgPSBcIlByb2R1Y3RkYXRhXCI7XHJcbiIsIi8vIC8vIFNjaGVtYSBkdSBwcm9maWxcclxuLy8gR2xvYmFscy5zY2hlbWFzLlVzZXJQcm9maWxlID0gU2ltcGxlU2NoZW1hKHtcclxuLy8gICAgIG5hbWU6IHtcclxuLy8gICAgICAgdHlwZTpTdHJpbmcsXHJcbi8vICAgICAgIHJlZ0V4Oi9eW2EtekEtWi1dezIsMjV9LyxcclxuLy8gICAgICAgb3B0aW9uYWw6dHJ1ZSxcclxuLy8gICAgICAgbGFiZWw6XCJQcmVub21cIlxyXG4vLyAgICAgfSxcclxuLy8gICAgIGxhc3RuYW1lOiB7XHJcbi8vICAgICAgIHR5cGU6U3RyaW5nLFxyXG4vLyAgICAgICByZWdFeDovXlthLXpBLVotXXsyLDI1fS8sXHJcbi8vICAgICAgIG9wdGlvbmFsOnRydWUsXHJcbi8vICAgICAgIGxhYmVsOlwiTm9tXCJcclxuLy8gICAgIH0sXHJcbi8vICAgICBiaXJ0aGRheToge1xyXG4vLyAgICAgICB0eXBlOiBEYXRlLFxyXG4vLyAgICAgICBvcHRpb25hbDogdHJ1ZSxcclxuLy8gICAgICAgbGFiZWw6IFwiRGF0ZSBkZSBuYWlzc2FuY2VcIlxyXG4vLyAgICAgfSxcclxuLy8gICAgIGdlbmRlcjp7XHJcbi8vICAgICAgIHR5cGU6U3RyaW5nLFxyXG4vLyAgICAgICBhbGxvd2VkVmFsdWVzOiBbJ00nLCdGJ10sXHJcbi8vICAgICAgIG9wdGlvbmFsOnRydWUsXHJcbi8vICAgICAgIGxhYmVsOlwiR2VucmVcIixcclxuLy8gICAgICAgYXV0b2Zvcm06IHtcclxuLy8gICAgICAgICBhZkZpZWxkSW5wdXQ6IHtcclxuLy8gICAgICAgICAgIHR5cGU6XCJzZWxlY3QyXCIsXHJcbi8vICAgICAgICAgICBvcHRpb25zOiBbXHJcbi8vICAgICAgICAgICAgICAge1xyXG4vLyAgICAgICAgICAgICAgICAgdmFsdWU6XCJNXCIsXHJcbi8vICAgICAgICAgICAgICAgICBsYWJlbDpcIkhvbW1lXCJcclxuLy8gICAgICAgICAgICAgICB9LFxyXG4vLyAgICAgICAgICAgICAgIHtcclxuLy8gICAgICAgICAgICAgICAgIHZhbHVlOlwiRlwiLFxyXG4vLyAgICAgICAgICAgICAgICAgbGFiZWw6XCJGZW1tZVwiXHJcbi8vICAgICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgICAgXVxyXG4vLyAgICAgICAgIH1cclxuLy8gICAgICAgfVxyXG4vLyAgICAgfSxcclxuLy8gICAgIGF2YXRhcl91cmw6IHtcclxuLy8gICAgICAgdHlwZTogU3RyaW5nLFxyXG4vLyAgICAgICBsYWJlbDpcIlBpY3R1cmVcIixcclxuLy8gICAgICAgYXV0b2Zvcm06IHtcclxuLy8gICAgICAgICBhZkZpZWxkSW5wdXQ6IHtcclxuLy8gICAgICAgICAgIHR5cGU6IFwiY2ZzLWZpbGVcIixcclxuLy8gICAgICAgICAgIGNvbGxlY3Rpb246IFwiaW1hZ2VzXCJcclxuLy8gICAgICAgICB9XHJcbi8vICAgICAgIH1cclxuLy8gICAgIH0sXHJcbi8vICAgICBvcmdhbml6YXRpb246IHtcclxuLy8gICAgICAgdHlwZTpTdHJpbmcsXHJcbi8vICAgICAgIHJlZ0V4Oi9eW2EtekEtWi1dezIsMjV9LyxcclxuLy8gICAgICAgb3B0aW9uYWw6dHJ1ZSxcclxuLy8gICAgICAgbGFiZWw6XCJPcmdhbmlzYXRpb25cIlxyXG4vLyAgICAgfSxcclxuLy8gICAgIG9jY3VwYXRpb246IHtcclxuLy8gICAgICAgdHlwZTpTdHJpbmcsXHJcbi8vICAgICAgIHJlZ0V4Oi9eW2EtejAtOUEtWiAuXXszLDMwfSQvLFxyXG4vLyAgICAgICBvcHRpb25hbDp0cnVlLFxyXG4vLyAgICAgICBsYWJlbDpcIk9jY3VwYXRpb25cIlxyXG4vLyAgICAgfSxcclxuLy8gICAgIG1vYmlsZToge1xyXG4vLyAgICAgICB0eXBlOlN0cmluZyxcclxuLy8gICAgICAgcmVnRXg6L15bYS16QS1aLV17MiwyNX0vLFxyXG4vLyAgICAgICBvcHRpb25hbDp0cnVlLFxyXG4vLyAgICAgICBsYWJlbDpcIlBob25lIE51bWJlclwiXHJcbi8vICAgICB9LFxyXG4vLyAgICAgd2Vic2l0ZToge1xyXG4vLyAgICAgICB0eXBlOlN0cmluZyxcclxuLy8gICAgICAgcmVnRXg6U2ltcGxlU2NoZW1hLlJlZ0V4LlVybCxcclxuLy8gICAgICAgb3B0aW9uYWw6dHJ1ZSxcclxuLy8gICAgICAgbGFiZWw6XCJTaXRlIFdlYlwiXHJcbi8vICAgICB9LFxyXG4vLyAgICAgYmlvOiB7XHJcbi8vICAgICAgIHR5cGU6U3RyaW5nLFxyXG4vLyAgICAgICBvcHRpb25hbDp0cnVlLFxyXG4vLyAgICAgICBsYWJlbDpcIkJpb2dyYXBoaWVcIixcclxuLy8gICAgICAgYXV0b2Zvcm06IHtcclxuLy8gICAgICAgICBhZkZpZWxkSW5wdXQ6e1xyXG4vLyAgICAgICAgICAgdHlwZTpcInRleHRhcmVhXCJcclxuLy8gICAgICAgICB9XHJcbi8vICAgICAgIH1cclxuLy8gICAgIH0sXHJcbi8vICAgICBzdGF0dXM6IHtcclxuLy8gICAgICAgdHlwZTpTdHJpbmcsXHJcbi8vICAgICAgIG9wdGlvbmFsOnRydWUsXHJcbi8vICAgICAgIGxhYmVsOlwiU3RhdHV0XCIsXHJcbi8vICAgICAgIGF1dG9mb3JtOiB7XHJcbi8vICAgICAgICAgYWZGaWVsZElucHV0OntcclxuLy8gICAgICAgICAgIHR5cGU6XCJ0ZXh0YXJlYVwiXHJcbi8vICAgICAgICAgfVxyXG4vLyAgICAgICB9XHJcbi8vICAgICB9XHJcbi8vIH0pXHJcbi8vIC8vU2NoZW1hIHByaW5jaXBhbFxyXG4vLyBHbG9iYWxzLnNjaGVtYXMuVXNlciA9IG5ldyBTaW1wbGVTY2hlbWEoe1xyXG4vLyAgICAgdXNlcm5hbWU6e1xyXG4vLyAgICAgICB0eXBlOiBTdHJpbmcsXHJcbi8vICAgICAgIHJlZ0V4Oi9eW2EtejAtOUEtWl9dezMsMTV9JC8sXHJcbi8vICAgICAgIGxhYmVsOlwiTm9tIGQndXRpbGlzYXRldXJcIlxyXG4vLyAgICAgfSxcclxuLy8gICAgIHBhc3N3b3JkOiB7XHJcbi8vICAgICAgIHR5cGU6U3RyaW5nLFxyXG4vLyAgICAgICBsYWJlbDpcIk1vdCBkZSBwYXNzZVwiLFxyXG4vLyAgICAgICBvcHRpb25hbDp0cnVlLFxyXG4vLyAgICAgICBhdXRvZm9ybToge1xyXG4vLyAgICAgICAgIGFmRmllbGRJbnB1dDp7XHJcbi8vICAgICAgICAgICB0eXBlOlwicGFzc3dvcmRcIlxyXG4vLyAgICAgICAgIH1cclxuLy8gICAgICAgfVxyXG4vLyAgICAgfSxcclxuLy8gICAgIGNvbmZpcm1hdGlvbjoge1xyXG4vLyAgICAgICB0eXBlOlN0cmluZyxcclxuLy8gICAgICAgbGFiZWw6XCJDb25maXJtYXRpb25cIixcclxuLy8gICAgICAgb3B0aW9uYWw6dHJ1ZSxcclxuLy8gICAgICAgY3VzdG9tOiBmdW5jdGlvbigpe1xyXG4vLyAgICAgICAgICAgaWYgKHRoaXMudmFsdWUgIT09IHRoaXMuZmllbGQoJ3Bhc3N3b3JkJykudmFsdWUpe1xyXG4vLyAgICAgICAgICAgICAgIHJldHVybiBcInBhc3N3b3JkTWlzc21hdGNoXCI7XHJcbi8vICAgICAgICAgICB9XHJcbi8vICAgICAgIH0sXHJcbi8vICAgICAgIGF1dG9mb3JtOiB7XHJcbi8vICAgICAgICAgYWZGaWVsZElucHV0OntcclxuLy8gICAgICAgICAgIHR5cGU6XCJwYXNzd29yZFwiXHJcbi8vICAgICAgICAgfVxyXG4vLyAgICAgICB9XHJcbi8vICAgICB9LFxyXG4vLyAgICAgZW1haWxzOntcclxuLy8gICAgICAgdHlwZTpbT2JqZWN0XSxcclxuLy8gICAgICAgb3B0aW9uYWw6IGZhbHNlLFxyXG4vLyAgICAgICBsYWJlbDogXCJBZHJlc3NlcyBFbWFpbFwiXHJcbi8vICAgICB9LFxyXG4vLyAgICAgXCJlbWFpbHMuJC5hZGRyZXNzXCI6IHtcclxuLy8gICAgICAgdHlwZTogU3RyaW5nLFxyXG4vLyAgICAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsLFxyXG4vLyAgICAgICBsYWJlbDogXCJBZHJlc3NlXCJcclxuLy8gICAgIH0sXHJcbi8vICAgICBcImVtYWlscy4kLnZlcmlmaWVkXCI6IHtcclxuLy8gICAgICAgdHlwZTogQm9vbGVhbixcclxuLy8gICAgICAgb3B0aW9uYWw6dHJ1ZSxcclxuLy8gICAgICAgYXV0b2Zvcm06IHtcclxuLy8gICAgICAgICBvbWl0OiB0cnVlXHJcbi8vICAgICAgIH1cclxuLy8gICAgIH0sXHJcbi8vICAgICBjcmVhdGVkQXQ6IHtcclxuLy8gICAgICAgICB0eXBlOiBEYXRlLFxyXG4vLyAgICAgICAgIGF1dG9WYWx1ZTogZnVuY3Rpb24gKCkge1xyXG4vLyAgICAgICAgICAgICBpZiAodGhpcy5pc0luc2VydCkge1xyXG4vLyAgICAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZTtcclxuLy8gICAgICAgICAgICAgfWVsc2Uge1xyXG4vLyAgICAgICAgICAgICAgIHRoaXMudW5zZXQoKTtcclxuLy8gICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgIH0sXHJcbi8vICAgICAgICAgYXV0b2Zvcm06IHtcclxuLy8gICAgICAgICAgICAgb21pdDogdHJ1ZVxyXG4vLyAgICAgICAgIH1cclxuLy8gICAgIH0sXHJcbi8vICAgICBwcm9maWxlOiB7XHJcbi8vICAgICAgICAgdHlwZTogR2xvYmFscy5zY2hlbWFzLnVzZXJQcm9maWxlLFxyXG4vLyAgICAgICAgIG9wdGlvbmFsOiB0cnVlLFxyXG4vL1xyXG4vLyAgICAgfSxcclxuLy8gICAgIHNlcnZpY2VzOiB7XHJcbi8vICAgICAgICAgdHlwZTogT2JqZWN0LFxyXG4vLyAgICAgICAgIG9wdGlvbmFsOiB0cnVlLFxyXG4vLyAgICAgICAgIGJsYWNrYm94OiB0cnVlLFxyXG4vLyAgICAgICAgIGF1dG9mb3JtOntcclxuLy8gICAgICAgICAgICAgb21pdDp0cnVlXHJcbi8vICAgICAgICAgfVxyXG4vLyAgICAgfSxcclxuLy8gICAgIHJvbGVzOiB7XHJcbi8vICAgICAgIHR5cGU6IFtTdHJpbmddLFxyXG4vLyAgICAgICBvcHRpb25hbDogdHJ1ZSxcclxuLy8gICAgICAgYXV0b2Zvcm06e1xyXG4vLyAgICAgICAgIG9taXQ6IHRydWVcclxuLy8gICAgICAgfVxyXG4vLyAgICAgfVxyXG4vL1xyXG4vLyB9KTtcclxuLy8gLy9vbiBhdHRhY2hlIGNlIHNjaGVtYSDDoSBsYSBjb2xsZWN0aW9uXHJcbi8vIE1ldGVvci51c2Vycy5hdHRhY2hTY2hlbWEoR2xvYmFscy5zY2hlbWFzLlVzZXIpO1xyXG4iLCJBaWRlU29pZ25hbnRzID0gbmV3IE1vbmdvLkNvbGxlY3Rpb24oJ2FpZGVTb2lnbmFudHMnKTtcclxuXHJcblNjaGVtYXMgPSB7fTtcclxuXHJcbkFpZGVTb2lnbmFudHMuYWxsb3coe1xyXG5cclxuICAgIGluc2VydCA6IGZ1bmN0aW9uKHVzZXJJZCxkb2Mpe1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgICB9LFxyXG4gICAgdXBkYXRlIDogZnVuY3Rpb24odXNlcklkLGRvYyxmaWVsZE5hbWVzLG1vZGlmaWVyKXtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSxcclxuICAgIHJlbW92ZSA6IGZ1bmN0aW9uKHVzZXJJZCxkb2Mpe1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgICB9LFxyXG4gICAgICBmZXRjaDogWydvd25lciddXHJcbiAgICB9KTtcclxuICAgIFxyXG5BaWRlU29pZ25hbnRzLnNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xyXG4gIG5vbTogeyB0eXBlOiBTdHJpbmcgfSxcclxuICBwcmVub206IHsgdHlwZTogU3RyaW5nIH0sXHJcbiAgc3BlY2lhbGl0ZTogeyB0eXBlOiBTdHJpbmcgfSxcclxuICB0ZWxlcGhvbmU6IHsgdHlwZTogU3RyaW5nIH0sXHJcbiAgcmVnaW9uOiB7IHR5cGU6IFN0cmluZywgbGFiZWw6IFwiUsOpZ2lvblwiIH0sXHJcbiAgdmlsbGU6IHsgdHlwZTogU3RyaW5nLCBsYWJlbDogXCJWaWxsZVwiIH0sXHJcbiAgcXVhcnRpZXI6IHsgdHlwZTogU3RyaW5nLCBvcHRpb25hbDogdHJ1ZSwgbGFiZWw6IFwiUXVhcnRpZXJcIiB9LFxyXG4gIGxvY2FsaXNhdGlvbjoge1xyXG4gICAgdHlwZTogT2JqZWN0LFxyXG4gICAgb3B0aW9uYWw6IHRydWVcclxuICB9LFxyXG4gICdsb2NhbGlzYXRpb24ubGF0Jzoge1xyXG4gICAgdHlwZTogTnVtYmVyLFxyXG4gICAgbGFiZWw6IFwiTGF0aXR1ZGVcIixcclxuICAgIGRlY2ltYWw6IHRydWUsXHJcbiAgICBhdXRvZm9ybTogeyBzdGVwOiAwLjAwMDAwMSB9XHJcbiAgfSxcclxuICAnbG9jYWxpc2F0aW9uLmxuZyc6IHtcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIGxhYmVsOiBcIkxvbmdpdHVkZVwiLFxyXG4gICAgZGVjaW1hbDogdHJ1ZSxcclxuICAgIGF1dG9mb3JtOiB7IHN0ZXA6IDAuMDAwMDAxIH1cclxuICB9LFxyXG4gIGRpc3BvbmlibGU6IHsgdHlwZTogQm9vbGVhbiwgZGVmYXVsdFZhbHVlOiB0cnVlIH0sXHJcbiAgZGVybmllckFwcGVsOiB7IHR5cGU6IERhdGUsIG9wdGlvbmFsOiB0cnVlIH0sXHJcbiAgXHJcbiAgLy8g8J+GlSBBam91dCBkdSBjaGFtcCBpbWJyaXF1w6kgcG91ciBsZXMgZG9jdW1lbnRzXHJcbiAgZG9jdW1lbnRzX3BlcnNvOiB7XHJcbiAgICB0eXBlOiBPYmplY3QsXHJcbiAgICBsYWJlbDogXCJEb2N1bWVudHMgUGVyc29ubmVsc1wiLFxyXG4gICAgb3B0aW9uYWw6IHRydWVcclxuICB9LFxyXG4gICdkb2N1bWVudHNfcGVyc28uY25pJzoge1xyXG4gICAgdHlwZTogU3RyaW5nLFxyXG4gICAgbGFiZWw6IFwiQ2FydGUgTmF0aW9uYWxlIGQnSWRlbnRpdMOpIChQREYpXCIsXHJcbiAgICBvcHRpb25hbDogdHJ1ZSxcclxuICAgIGF1dG9mb3JtOiB7XHJcbiAgICAgIGFmRmllbGRJbnB1dDoge1xyXG4gICAgICAgIHR5cGU6IFwiY2ZzLWZpbGVcIixcclxuICAgICAgICBjb2xsZWN0aW9uOiBcImRvY3VtZW50c1wiLFxyXG4gICAgICAgIGFjY2VwdDogJ2FwcGxpY2F0aW9uL3BkZidcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgfSxcclxuICAnZG9jdW1lbnRzX3BlcnNvLmRpcGxvbWUnOiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBsYWJlbDogXCJEaXBsb21lIChQREYpXCIsXHJcbiAgICBvcHRpb25hbDogdHJ1ZSxcclxuICAgIGF1dG9mb3JtOiB7XHJcbiAgICAgIGFmRmllbGRJbnB1dDoge1xyXG4gICAgICAgIHR5cGU6IFwiY2ZzLWZpbGVcIixcclxuICAgICAgICBjb2xsZWN0aW9uOiBcImRvY3VtZW50c1wiLFxyXG4gICAgICAgIGFjY2VwdDogJ2FwcGxpY2F0aW9uL3BkZidcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gICdkb2N1bWVudHNfcGVyc28uY3YnOiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBvcHRpb25hbDogdHJ1ZSxcclxuICAgIGxhYmVsOiBcIkN1cnJpY3VsdW0gVml0YWUgKFBERilcIixcclxuICAgIGF1dG9mb3JtOiB7XHJcbiAgICAgIGFmRmllbGRJbnB1dDoge1xyXG4gICAgICAgIHR5cGU6IFwiY2ZzLWZpbGVcIixcclxuICAgICAgICBjb2xsZWN0aW9uOiBcImRvY3VtZW50c1wiLFxyXG4gICAgICAgIGFjY2VwdDogJ2FwcGxpY2F0aW9uL3BkZidcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGNyZWF0ZWRBdDoge1xyXG4gICAgdHlwZTogRGF0ZSxcclxuICAgIGxhYmVsOiBcIkNyZWF0ZWQgQXRcIixcclxuICAgIGF1dG9WYWx1ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAodGhpcy5pc0luc2VydCkgcmV0dXJuIG5ldyBEYXRlO1xyXG4gICAgfSxcclxuICAgIGF1dG9mb3JtOiB7IHR5cGU6IFwiaGlkZGVuXCIgfVxyXG4gIH0sXHJcbiAgYWRkZWRCeToge1xyXG4gICAgdHlwZTogU3RyaW5nLFxyXG4gICAgbGFiZWw6IFwiQ3JlYXRlZCBCeVwiLFxyXG4gICAgYXV0b1ZhbHVlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGlmICh0aGlzLmlzSW5zZXJ0KSByZXR1cm4gdGhpcy51c2VySWQ7XHJcbiAgICB9LFxyXG4gICAgYXV0b2Zvcm06IHsgdHlwZTogXCJoaWRkZW5cIiB9XHJcbiAgfSxcclxuICB1cGRhdGVkQXQ6IHtcclxuICAgIHR5cGU6IERhdGUsXHJcbiAgICBsYWJlbDogXCJVcGRhdGVkIEF0XCIsXHJcbiAgICBhdXRvVmFsdWU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKHRoaXMuaXNVcGRhdGUpIHJldHVybiBuZXcgRGF0ZSgpO1xyXG4gICAgfSxcclxuICAgIGF1dG9mb3JtOiB7IHR5cGU6IFwiaGlkZGVuXCIgfSxcclxuICAgIGRlbnlJbnNlcnQ6IHRydWUsXHJcbiAgICBvcHRpb25hbDogdHJ1ZVxyXG4gIH0sXHJcbn0pO1xyXG5cclxuXHJcbkFpZGVTb2lnbmFudHMuYXR0YWNoU2NoZW1hKEFpZGVTb2lnbmFudHMuc2NoZW1hKTtcclxuIiwiLy9cclxuLy8gICB2YXIgYXJ0aWNsZVN0b3JlID0gbmV3IEZTLlN0b3JlLlMzKFwiYXJ0aWNsZVN0b3JlXCIse1xyXG4vLyAgICAgcmVnaW9uOiBcInVzLWVhc3QtMVwiLCAvL29wdGlvbmFsIGluIG1vc3QgY2FzZXNcclxuLy8gICAgIGFjY2Vzc0tleUlkOiBcImEwYTJlMTQzZWExM2M0MTIyYWFlNjZkMzljYmI2NTAxNTFkYlwiLCAvL3JlcXVpcmVkIGlmIGVudmlyb25tZW50IHZhcmlhYmxlcyBhcmUgbm90IHNldFxyXG4vLyAgICAgc2VjcmV0QWNjZXNzS2V5OiBcIjkxZmNlZTAzMDgzN2ZmMDk5ZGViMDdlZjc4ZDNcIiwgLy9yZXF1aXJlZCBpZiBlbnZpcm9ubWVudCB2YXJpYWJsZXMgYXJlIG5vdCBzZXRcclxuLy8gICAgIGJ1Y2tldDogXCJxdWlja3BoYXJtYnVja2V0XCIsIC8vcmVxdWlyZWRcclxuLy8gICAgIEFDTDogXCJwcml2YXRlXCIsIC8vb3B0aW9uYWwsIGRlZmF1bHQgaXMgJ3ByaXZhdGUnLCBidXQgeW91IGNhbiBhbGxvdyBwdWJsaWMgb3Igc2VjdXJlIGFjY2VzcyByb3V0ZWQgdGhyb3VnaCB5b3VyIGFwcCBVUkxcclxuLy8gICAgIGZvbGRlcjogXCJmb2xkZXIvaW4vYnVja2V0XCIsIC8vb3B0aW9uYWwsIHdoaWNoIGZvbGRlciAoa2V5IHByZWZpeCkgaW4gdGhlIGJ1Y2tldCB0byB1c2VcclxuLy8gICAgIC8vIFRoZSByZXN0IGFyZSBnZW5lcmljIHN0b3JlIG9wdGlvbnMgc3VwcG9ydGVkIGJ5IGFsbCBzdG9yYWdlIGFkYXB0ZXJzXHJcbi8vICAgICAvL3RyYW5zZm9ybVdyaXRlOiBteVRyYW5zZm9ybVdyaXRlRnVuY3Rpb24sIC8vb3B0aW9uYWxcclxuLy8gICAgIC8vdHJhbnNmb3JtUmVhZDogbXlUcmFuc2Zvcm1SZWFkRnVuY3Rpb24sIC8vb3B0aW9uYWxcclxuLy8gICAgIG1heFRyaWVzOiA1IC8vb3B0aW9uYWwsIGRlZmF1bHQgNSk7XHJcbi8vICAgfSk7XHJcbi8vICAgdmFyIGFydGljbGVzVGh1bWJzID0gbmV3IEZTLlN0b3JlLlMzKFwiYXJ0aWNsZXNUaHVtYnNcIix7XHJcbi8vICAgICByZWdpb246IFwidXMtZWFzdC0xXCIsIC8vb3B0aW9uYWwgaW4gbW9zdCBjYXNlc1xyXG4vLyAgICAgYWNjZXNzS2V5SWQ6IFwiYTBhMmUxNDNlYTEzYzQxMjJhYWU2NmQzOWNiYjY1MDE1MWRiXCIsIC8vcmVxdWlyZWQgaWYgZW52aXJvbm1lbnQgdmFyaWFibGVzIGFyZSBub3Qgc2V0XHJcbi8vICAgICBzZWNyZXRBY2Nlc3NLZXk6IFwiOTFmY2VlMDMwODM3ZmYwOTlkZWIwN2VmNzhkM1wiLCAvL3JlcXVpcmVkIGlmIGVudmlyb25tZW50IHZhcmlhYmxlcyBhcmUgbm90IHNldFxyXG4vLyAgICAgYnVja2V0OiBcImFydGljbGV0aHVtYnNidWNrZXRcIiwgLy9yZXF1aXJlZFxyXG4vLyAgICAgQUNMOiBcInByaXZhdGVcIiwgLy9vcHRpb25hbCwgZGVmYXVsdCBpcyAncHJpdmF0ZScsIGJ1dCB5b3UgY2FuIGFsbG93IHB1YmxpYyBvciBzZWN1cmUgYWNjZXNzIHJvdXRlZCB0aHJvdWdoIHlvdXIgYXBwIFVSTFxyXG4vLyAgICAgZm9sZGVyOiBcImZvbGRlci9pbi9idWNrZXRcIiwgLy9vcHRpb25hbCwgd2hpY2ggZm9sZGVyIChrZXkgcHJlZml4KSBpbiB0aGUgYnVja2V0IHRvIHVzZVxyXG4vLyAgICAgLy8gVGhlIHJlc3QgYXJlIGdlbmVyaWMgc3RvcmUgb3B0aW9ucyBzdXBwb3J0ZWQgYnkgYWxsIHN0b3JhZ2UgYWRhcHRlcnNcclxuLy8gICAgIC8vdHJhbnNmb3JtV3JpdGU6IG15VHJhbnNmb3JtV3JpdGVGdW5jdGlvbiwgLy9vcHRpb25hbFxyXG4vLyAgICAgLy90cmFuc2Zvcm1SZWFkOiBteVRyYW5zZm9ybVJlYWRGdW5jdGlvbiwgLy9vcHRpb25hbFxyXG4vLyAgICAgbWF4VHJpZXM6IDUgLy9vcHRpb25hbCwgZGVmYXVsdCA1KTtcclxuLy8gICB9KTtcclxuLy9cclxuLy8gICB2YXIgY3JlYXRlVGh1bWIgPSBmdW5jdGlvbihmaWxlT2JqLCByZWFkU3RyZWFtLCB3cml0ZVN0cmVhbSl7XHJcbi8vICAgLy90cmFuc2Zvcm0gaW1hZ2UgaW50byAgYSAxMCoxMCBwaXhlbCB0aHVtYm5haWxcclxuLy8gICBnbShyZWFkU3RyZWFtLCBmaWxlT2JqLm5hbWUoKSkucmVzaXplKCcxMCcsJzEwJykuc3RyZWFtKCkucGlwZSh3cml0ZVN0cmVhbSk7XHJcbi8vIH07XHJcbnZhciBhcnRpY2xlU3RvcmUgPSBuZXcgRlMuU3RvcmUuRmlsZVN5c3RlbShcImFydGljbGVzXCJcclxuLy8gLHtcclxuICAgIC8vICAgXHRwYXRoOiBcIi4vdXBsb2Fkcy9hcnRpY2xlc1wiLFxyXG5cdCAgLy8gbWF4VHJpZXM6NVxyXG4vLyB9XHJcbik7XHJcbkFydGljbGVzID0gbmV3IEZTLkNvbGxlY3Rpb24oXCJhcnRpY2xlc1wiLCB7XHJcblx0IHN0b3JlczogW2FydGljbGVTdG9yZV1cclxuICAvLyBuZXcgRlMuU3RvcmUuRmlsZVN5c3RlbShcInRodW1ic1wiLHsgdHJhbnNmb3JtV3JpdGU6IGNyZWF0ZVRodW1ifSldXHJcblx0Ly8gLCBmaWx0ZXI6IHtcclxuXHQvLyAgICAgICBhbGxvdzoge1xyXG5cdC8vICAgICAgICAgY29udGVudFR5cGVzOiBbJ2ltYWdlL2pwZyddXHJcbiAgLy9cclxuXHQvLyAgICAgICB9LFxyXG4gIC8vXHJcblx0Ly8gICAgICAgb25JbnZhbGlkOiBmdW5jdGlvbihtZXNzYWdlKSB7XHJcblx0Ly8gICAgICAgICBjb25zb2xlLmxvZyhtZXNzYWdlKTtcclxuXHQvLyAgICAgICB9XHJcblx0Ly8gICAgIH1cclxuXHR9KTtcclxuXHJcbi8vQXJ0aWNsZXMgY29sbGVjdGlvbiBwZXJtaXNzaW9uXHJcbi8vIHZhciBhcnRpY2xlU3RvcmUgPSBuZXcgRlMuU3RvcmUuUzMoXCJpbWFnZXNcIiwge1xyXG4vLyAgICAgYWNjZXNzS2V5SWQ6IFwieHh4eFwiLFxyXG4vLyAgICAgc2VjcmV0QWNjZXNzS2V5OiBcInh4eHhcIixcclxuLy8gICAgIGJ1Y2tldDogXCJ3d3cubXlidWNrZXQuY29tXCJcclxuLy8gfSk7XHJcblxyXG5cclxuLy9pZihNZXRlb3IuaXNTZXJ2ZXIpe1xyXG5BcnRpY2xlcy5hbGxvdyh7XHJcblxyXG5cdGluc2VydCA6IGZ1bmN0aW9uKHVzZXJJZCxkb2Mpe1xyXG5cdHJldHVybiB0cnVlO1xyXG5cdH0sXHJcblx0dXBkYXRlIDogZnVuY3Rpb24odXNlcklkLGRvYyxmaWVsZE5hbWVzLG1vZGlmaWVyKXtcclxuXHRyZXR1cm4gdHJ1ZTtcclxuXHR9LFxyXG5cdHJlbW92ZSA6IGZ1bmN0aW9uKHVzZXJJZCxkb2Mpe1xyXG5cdHJldHVybiB0cnVlO1xyXG5cdH0sXHJcblx0ZG93bmxvYWQ6IGZ1bmN0aW9uKCl7XHJcblx0cmV0dXJuIHRydWU7XHJcblx0fSxcclxuXHQgIGZldGNoOiBbJ093bmVyJ11cclxuXHJcbn0pO1xyXG4vL31cclxuIiwiQ2FydCA9IG5ldyBNb25nby5Db2xsZWN0aW9uKFwiY2FydFwiKTtcclxuXHJcbkNhcnQuYWxsb3coe1xyXG5cclxuaW5zZXJ0IDogZnVuY3Rpb24odXNlcklkLGRvYyl7XHJcbnJldHVybiB0cnVlO1xyXG59LFxyXG51cGRhdGUgOiBmdW5jdGlvbih1c2VySWQsZG9jLGZpZWxkTmFtZXMsbW9kaWZpZXIpe1xyXG5yZXR1cm4gdHJ1ZTtcclxufSxcclxucmVtb3ZlIDogZnVuY3Rpb24odXNlcklkLGRvYyl7XHJcbnJldHVybiB0cnVlO1xyXG59LFxyXG4gIGZldGNoOiBbJ293bmVyJ11cclxufSk7XHJcbiIsIkRvY3VtZW50cyA9IG5ldyBGUy5Db2xsZWN0aW9uKFwiZG9jdW1lbnRzXCIsIHtcclxuICBzdG9yZXM6IFtuZXcgRlMuU3RvcmUuRmlsZVN5c3RlbShcImRvY3VtZW50c1wiLCB7IHBhdGg6IFwifi91cGxvYWRzL2RvY3VtZW50c1wiIH0pXVxyXG59KTtcclxuXHJcbkRvY3VtZW50cy5hbGxvdyh7XHJcbiAgaW5zZXJ0OiAoKSA9PiB0cnVlLFxyXG4gIHVwZGF0ZTogKCkgPT4gdHJ1ZSxcclxuICByZW1vdmU6ICgpID0+IHRydWUsXHJcbiAgZG93bmxvYWQ6ICgpID0+IHRydWVcclxufSk7IiwiY29uc3QgeyBTZWxlY3QgfSA9IHJlcXVpcmUoXCJzZW1hbnRpYy11aS1yZWFjdFwiKTtcclxuXHJcbkV0YWJsaXNzZW1lbnRzID0gbmV3IE1vbmdvLkNvbGxlY3Rpb24oJ2V0YWJsaXNzZW1lbnRzJyk7XHJcblxyXG5FdGFibGlzc2VtZW50cy5hbGxvdyh7XHJcblxyXG4gICAgaW5zZXJ0IDogZnVuY3Rpb24odXNlcklkLGRvYyl7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0sXHJcbiAgICB1cGRhdGUgOiBmdW5jdGlvbih1c2VySWQsZG9jLGZpZWxkTmFtZXMsbW9kaWZpZXIpe1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgICB9LFxyXG4gICAgcmVtb3ZlIDogZnVuY3Rpb24odXNlcklkLGRvYyl7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0sXHJcbiAgICAgIGZldGNoOiBbJ293bmVyJ11cclxuICAgIH0pO1xyXG4gICAgU2NoZW1hcyA9IHt9O1xyXG5cclxuRXRhYmxpc3NlbWVudHMuYXR0YWNoU2NoZW1hKG5ldyBTaW1wbGVTY2hlbWEoe1xyXG4gIG5vbToge1xyXG4gICAgdHlwZTogU3RyaW5nLFxyXG4gICAgbGFiZWw6IFwiTm9tIGRlIGwnw6l0YWJsaXNzZW1lbnRcIixcclxuICB9LFxyXG4gIHR5cGU6IHtcclxuICAgIHR5cGU6IFN0cmluZyxcclxuICAgIGFsbG93ZWRWYWx1ZXM6IFtcclxuICAgICAgXCJIw7RwaXRhbCBnw6luw6lyYWxcIixcclxuICAgICAgXCJIw7RwaXRhbCBjZW50cmFsXCIsXHJcbiAgICAgIFwiSMO0cGl0YWwgZGUgZGlzdHJpY3RcIixcclxuICAgICAgXCJDbGluaXF1ZVwiLFxyXG4gICAgICBcIkNlbnRyZSBkZSBzYW50w6lcIixcclxuICAgICAgXCJEaXNwZW5zYWlyZVwiLFxyXG4gICAgICBcIkxhYm9yYXRvaXJlIGTigJlhbmFseXNlc1wiLFxyXG4gICAgICBcIkNlbnRyZSBkZSBkaWFnbm9zdGljXCIsXHJcbiAgICAgIFwiQ2VudHJlIGRlIHNhbnTDqSBpbnTDqWdyw6lcIixcclxuICAgICAgXCJIw7RwaXRhbCBkZSBkaXN0cmljdFwiLFxyXG4gICAgICBcIkNlbnRyZSBk4oCZaW1hZ2VyaWVcIixcclxuICAgICAgXCJDZW50cmUgb3BodGFsbW9sb2dpcXVlXCIsXHJcbiAgICAgIFwiQ2VudHJlIGRlIE1hdGVybml0w6lcIixcclxuICAgICAgXCJDZW50cmUgZGUgR3luw6ljb2xvZ2llXCIsXHJcbiAgICAgIFwiQ2VudHJlIFDDqWRpYXRyaXF1ZVwiLFxyXG4gICAgICBcIkNhYmluZXQgbcOpZGljYWxcIixcclxuICAgICAgXCJDYWJpbmV0IGRlbnRhaXJlXCIsXHJcbiAgICAgIFwiQ2VudHJlIGRlIHLDqcOpZHVjYXRpb25cIixcclxuICAgICAgXCJBdXRyZVwiXHJcbiAgICBdLFxyXG4gICAgbGFiZWw6IFwiVHlwZSBkJ8OpdGFibGlzc2VtZW50XCIsXHJcbiAgfSxcclxuICByZWdpb246IHtcclxuICAgIHR5cGU6IFN0cmluZyxcclxuICAgIGxhYmVsOiBcIlLDqWdpb25cIixcclxuICB9LFxyXG4gIHZpbGxlOiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBsYWJlbDogXCJWaWxsZVwiLFxyXG4gIH0sXHJcbiAgcXVhcnRpZXI6IHtcclxuICAgIHR5cGU6IFN0cmluZyxcclxuICAgIG9wdGlvbmFsOiB0cnVlLFxyXG4gICAgbGFiZWw6IFwiUXVhcnRpZXJcIixcclxuICB9LFxyXG4gIGFkcmVzc2U6IHtcclxuICAgIHR5cGU6IFN0cmluZyxcclxuICAgIG9wdGlvbmFsOiB0cnVlLFxyXG4gICAgbGFiZWw6IFwiQWRyZXNzZSBjb21wbMOodGVcIixcclxuICB9LFxyXG4gIGxvY2FsaXNhdGlvbjoge1xyXG4gICAgdHlwZTogT2JqZWN0LFxyXG4gICAgb3B0aW9uYWw6IHRydWVcclxuICB9LFxyXG4gICdsb2NhbGlzYXRpb24ubGF0JzogeyB0eXBlOiBOdW1iZXIsXHJcbiAgICBsYWJlbDogXCJMYXRpdHVkZVwiLFxyXG4gICAgZGVjaW1hbDogdHJ1ZSxcclxuICAgIGF1dG9mb3JtOiB7XHJcbiAgICAgIHN0ZXA6IDAuMDAwMDAxXHJcbiAgICB9XHJcbiAgfSxcclxuICAnbG9jYWxpc2F0aW9uLmxuZyc6IHsgdHlwZTogTnVtYmVyLFxyXG4gICAgbGFiZWw6IFwiTG9uZ2l0dWRlXCIsXHJcbiAgICBkZWNpbWFsOiB0cnVlLFxyXG4gICAgYXV0b2Zvcm06IHtcclxuICAgICAgc3RlcDogMC4wMDAwMDFcclxuICAgIH1cclxuICB9LFxyXG4gIHRlbGVwaG9uZToge1xyXG4gICAgdHlwZTogU3RyaW5nLFxyXG4gICAgb3B0aW9uYWw6IHRydWUsXHJcbiAgICBsYWJlbDogXCJUw6lsw6lwaG9uZVwiLFxyXG4gIH0sXHJcbiAgZW1haWw6IHtcclxuICAgIHR5cGU6IFN0cmluZyxcclxuICAgIG9wdGlvbmFsOiB0cnVlLFxyXG4gICAgcmVnRXg6IC9eW15cXHNAXStAW15cXHNAXStcXC5bXlxcc0BdKyQvLFxyXG4gICAgbGFiZWw6IFwiRW1haWxcIixcclxuICB9LFxyXG4gIHNpdGVXZWI6IHtcclxuICAgIHR5cGU6IFN0cmluZyxcclxuICAgIG9wdGlvbmFsOiB0cnVlLFxyXG4gICAgbGFiZWw6IFwiU2l0ZSBXZWJcIixcclxuICB9LFxyXG4gIGRhdGVBam91dDoge1xyXG4gICAgdHlwZTogRGF0ZSxcclxuICAgIGRlZmF1bHRWYWx1ZTogbmV3IERhdGUoKSxcclxuICAgIGxhYmVsOiBcIkRhdGUgZCdham91dFwiLFxyXG4gIH0sXHJcbn0pKTtcclxuXHJcbkV0YWJsaXNzZW1lbnRzLmF0dGFjaFNjaGVtYShTY2hlbWFzLkV0YWJsaXNzZW1lbnRzKTtcclxuIiwiXHJcbkZvdXJuaXNzZXVycyA9IG5ldyBNb25nby5Db2xsZWN0aW9uKCdmb3Vybmlzc2V1cnMnKTtcclxuRm91cm5pc3NldXJzLmFsbG93KHtcclxuXHJcbmluc2VydCA6IGZ1bmN0aW9uKHVzZXJJZCxkb2Mpe1xyXG5yZXR1cm4gdHJ1ZTtcclxufSxcclxudXBkYXRlIDogZnVuY3Rpb24odXNlcklkLGRvYyxmaWVsZE5hbWVzLG1vZGlmaWVyKXtcclxucmV0dXJuIHRydWU7XHJcbn0sXHJcbnJlbW92ZSA6IGZ1bmN0aW9uKHVzZXJJZCxkb2Mpe1xyXG5yZXR1cm4gdHJ1ZTtcclxufSxcclxuICBmZXRjaDogWydvd25lciddXHJcbn0pO1xyXG5TY2hlbWFzID0ge307XHJcblxyXG5Gb3Vybmlzc2V1cnMuYXR0YWNoU2NoZW1hKG5ldyBTaW1wbGVTY2hlbWEoe1xyXG4gIG5hbWU6IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICByZWdFeDogL15bYS16MC05QS1aIC5dezMsMzB9JC8sXHJcbiAgICAgIGxhYmVsOiBcIkxhYmVsXCJcclxuICAgIH0sXHJcbiAgIHdlYnNpdGU6IHtcclxuICAgICAgICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgICAgICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5VcmwsXHJcbiAgICAgICAgICAgb3B0aW9uYWw6IHRydWUsXHJcbiAgICAgICAgICAgbGFiZWw6IFwiU2l0ZSBXZWJcIlxyXG4gICAgICAgfSxcclxuICBlbWFpbHM6IHtcclxuICAgICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICAgICAgICAgICBvcHRpb25hbDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgIGxhYmVsOiBcIkFkcmVzc2VzIEVtYWlsXCJcclxuICAgICAgICAgICB9LFxyXG5cclxuXHJcbiAgICAgICAgICAgbW9iaWxlOiB7XHJcbiAgICAgICAgICAgICAgdHlwZTpTdHJpbmcsXHJcbiAgICAgICAgICAgICAgcmVnRXg6L15bYS16QS1aLV17MiwyNX0vLFxyXG4gICAgICAgICAgICAgIG9wdGlvbmFsOnRydWUsXHJcbiAgICAgICAgICAgICAgbGFiZWw6XCJQaG9uZSBOdW1iZXJcIlxyXG4gICAgICAgIH0sXHJcbiAgYWRyZXNzOntcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICBsYWJlbDpcIkFkcmVzc2VcIixcclxuICAgICAgYXV0b2Zvcm06IHtcclxuICAgICAgICAgIGFmRmllbGRJbnB1dDoge1xyXG4gICAgICAgICAgICAgIHR5cGU6IFwidGV4dGFyZWFcIixcclxuICAgICAgICAgICAgICBjbGFzczogXCJja2VkaXRvclwiLFxyXG4gICAgICAgICAgICAgIHJvd3M6IDJcclxuICAgICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAgY3JlYXRlZEF0OiB7XHJcbiAgICAgICAgIHR5cGU6IERhdGUsXHJcbiAgICAgICAgIGF1dG9WYWx1ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgaWYgKHRoaXMuaXNJbnNlcnQpIHtcclxuICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlO1xyXG4gICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgdGhpcy51bnNldCgpO1xyXG4gICAgICAgICAgICAgfVxyXG4gICAgICAgICB9LFxyXG4gICAgICAgICBhdXRvZm9ybToge1xyXG4gICAgICAgICAgICAgb21pdDogdHJ1ZVxyXG4gICAgICAgICB9XHJcbiAgICAgfSxcclxuXHJcbiAgICBsYXN0VXBkYXRlOiB7XHJcbiAgICAgICAgdHlwZTogRGF0ZSxcclxuICAgICAgICBvcHRpb25hbDogdHJ1ZSxcclxuICAgICAgICBhdXRvZm9ybToge1xyXG4gICAgICAgICAgICBvbWl0OiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBhdXRvVmFsdWU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc1VwZGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy51bnNldCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIGNyZWF0ZWRCeToge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgICBhdXRvZm9ybToge1xyXG4gICAgICAgICAgICBvbWl0OiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBhdXRvVmFsdWU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0luc2VydCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE1ldGVvci51c2VySWQoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudW5zZXQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkpO1xyXG5Gb3Vybmlzc2V1cnMuYXR0YWNoU2NoZW1hIChTY2hlbWFzLkZvdXJuaXNzZXVycyk7XHJcbiIsIiBpbWFnZVN0b3JlID0gbmV3IEZTLlN0b3JlLkZpbGVTeXN0ZW0oXCJpbWFnZXNcIiwge3BhdGg6IFwifi91cGxvYWRzL2ltYWdlc1wifSk7XHJcblx0SW1hZ2VzID0gbmV3IEZTLkNvbGxlY3Rpb24oXCJpbWFnZXNcIiwge1xyXG5cdCBzdG9yZXM6IFtpbWFnZVN0b3JlXVxyXG5cdH0pO1xyXG5cclxuXHRJbWFnZXMuYWxsb3coe1xyXG5cdCBpbnNlcnQ6IGZ1bmN0aW9uKCl7XHJcblx0IHJldHVybiB0cnVlO1xyXG5cdCB9LFxyXG5cdCB1cGRhdGU6IGZ1bmN0aW9uKCl7XHJcblx0IHJldHVybiB0cnVlO1xyXG5cdCB9LFxyXG5cdCByZW1vdmU6IGZ1bmN0aW9uKCl7XHJcblx0IHJldHVybiB0cnVlO1xyXG5cdCB9LFxyXG5cdCBkb3dubG9hZDogZnVuY3Rpb24oKXtcclxuXHQgcmV0dXJuIHRydWU7XHJcblx0IH1cclxuXHR9KTtcclxuIiwiXHJcbnNob3AgPSBcIlNob3BcIjtcclxuU2hvcCA9IG5ldyBNb25nby5Db2xsZWN0aW9uKCdzaG9wJyk7XHJcbk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xyXG4gIC8vU2hvcC5fZW5zdXJlSW5kZXgoe1wibG9jYXRpb24uZ2VvbWV0cnlcIjogXCIyZHNwaGVyZVwifSk7XHJcbn0pO1xyXG5TY2hlbWFzID0ge307XHJcbi8vU2hvcCBjb2xsZWN0aW9uIHBlcm1pc3Npb25cclxuU2hvcC5hbGxvdyh7XHJcblxyXG5pbnNlcnQgOiBmdW5jdGlvbih1c2VySWQsZG9jKXtcclxucmV0dXJuIHRydWU7XHJcbn0sXHJcbnVwZGF0ZSA6IGZ1bmN0aW9uKHVzZXJJZCxkb2MsZmllbGROYW1lcyxtb2RpZmllcil7XHJcbnJldHVybiB0cnVlO1xyXG59LFxyXG5yZW1vdmUgOiBmdW5jdGlvbih1c2VySWQsZG9jKXtcclxucmV0dXJuIHRydWU7XHJcbn0sXHJcbiAgZmV0Y2g6IFsnb3duZXInXVxyXG59KTtcclxuXHJcbi8vU2hvcCBhdXRvZm9ybSB3aXRoIGEgc2hvcGl0ZW0gYXV0b3JtIGluY2x1ZGVkXHJcbi8vIFRlYW1tZW1iZXIgU2ltcGxlU2NoZW1hXHJcbnRlYW1NYmVyID0gbmV3IFNpbXBsZVNjaGVtYSh7XHJcbiAgICBOb206e1xyXG5cdFx0XHRcdCAgdHlwZTogU3RyaW5nLFxyXG5cdFx0XHRcdCAgbGFiZWw6XCJOb21cIixcclxuICAgICAgICAgIHJlZ0V4Oi9eW2EtekEtWi1dezIsMjV9L1xyXG4gICAgfSxcclxuICAgIFByZW5vbTp7XHJcblx0XHRcdFx0ICB0eXBlOiBTdHJpbmcsXHJcblx0XHRcdFx0ICBsYWJlbDpcIlByZW5vbVwiLFxyXG4gICAgICAgICAgcmVnRXg6L15bYS16QS1aLV17MiwyNX0vXHJcbiAgICB9LFxyXG5cdFx0cGhvdG86e1xyXG5cdFx0XHRcdCAgdHlwZTogU3RyaW5nLFxyXG5cdFx0XHRcdCAgbGFiZWw6XCJQaG90b1wiLFxyXG5cclxuICAgICAgIGF1dG9mb3JtOiB7XHJcbiAgICAgICAgIGFmRmllbGRJbnB1dDoge1xyXG4gICAgICAgICAgIHR5cGU6IFwiY2ZzLWZpbGVcIixcclxuICAgICAgICAgICBjb2xsZWN0aW9uOiAnYXJ0aWNsZXMnXHJcbiAgICAgICAgIH1cclxuICAgICAgIH1cclxuXHRcdH0sXHJcbiAgICBiaXJ0aGRheToge1xyXG4gICAgICAgICAgdHlwZTogRGF0ZSxcclxuICAgICAgICAgIG9wdGlvbmFsOiB0cnVlLFxyXG4gICAgICAgICAgbGFiZWw6IFwiRGF0ZSBkZSBuYWlzc2FuY2VcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8gZ2VuZGVyOntcclxuICAgICAgICAvLyAgIHR5cGU6U3RyaW5nLFxyXG4gICAgICAgIC8vICAgb3B0aW9uYWw6IHRydWUsXHJcbiAgICAgICAgLy8gICBhbGxvd2VkVmFsdWVzOiBbJ00nLCdGJ10sXHJcbiAgICAgICAgLy8gICBsYWJlbDpcIkdlbnJlXCIsXHJcbiAgICAgICAgLy8gICBhdXRvZm9ybToge1xyXG4gICAgICAgIC8vICAgICBhZkZpZWxkSW5wdXQ6IHtcclxuICAgICAgICAvLyAgICAgICB0eXBlOlwic2VsZWN0LWNoZWNrYm94LWlubGluZVwiLFxyXG4gICAgICAgIC8vICAgICAgIG9wdGlvbnM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vICAgICAgICAgICByZXR1cm4gW3tcclxuICAgICAgICAvLyAgICAgICAgICAgICBsYWJlbDpcIkhvbW1lXCIsXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgdmFsdWU6IE1cclxuICAgICAgICAvLyAgICAgICAgICAgfSxcclxuICAgICAgICAvLyAgICAgICAgICAge1xyXG4gICAgICAgIC8vICAgICAgICAgICAgIGxhYmVsOlwiRmVtbWVcIixcclxuICAgICAgICAvLyAgICAgICAgICAgICB2YWx1ZTogRlxyXG4gICAgICAgIC8vICAgICAgICAgICB9XVxyXG4gICAgICAgIC8vICAgICAgICB9XHJcbiAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAvLyAgIH1cclxuICAgICAgICAvLyB9LFxyXG4gICAgICAgIGJpbzoge1xyXG4gICAgICAgICAgICAgIHR5cGU6U3RyaW5nLFxyXG4gICAgICAgICAgICAgIG9wdGlvbmFsOnRydWUsXHJcbiAgICAgICAgICAgICAgbGFiZWw6XCJCaW9ncmFwaGllXCIsXHJcbiAgICAgICAgICAgICAgYXV0b2Zvcm06IHtcclxuICAgICAgICAgICAgICAgIGFmRmllbGRJbnB1dDp7XHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6XCJ0ZXh0YXJlYVwiXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG5cdFx0UG9zdGUgOntcclxuXHRcdFx0XHR0eXBlOiBTdHJpbmcsXHJcblx0XHRcdFx0bGFiZWw6XCJGb25jdGlvblwiLFxyXG5cdFx0XHRcdGFsbG93ZWRWYWx1ZXM6IFsnUGhhcm1hY2llbicsICdDYWlzc2llcicsICdSZWNlcHRpb25pc3QnXSxcclxuXHRcdFx0ICAgIGF1dG9mb3JtOiB7XHJcblx0XHRcdCAgICAgIG9wdGlvbnM6IFtcclxuXHRcdFx0ICAgICAgICB7bGFiZWw6IFwiUGhhcm1hY2llblwiLCB2YWx1ZTogXCJQaGFybWFjaWVuXCJ9LFxyXG5cdFx0XHQgICAgICAgIHtsYWJlbDogXCJDYWlzc2llcihlKVwiLCB2YWx1ZTogXCJDYWlzc2llclwifSxcclxuXHRcdFx0ICAgICAgICB7bGFiZWw6IFwiUmVjZXB0aW9uaXN0KGUpXCIsIHZhbHVlOiBcIlJlY2VwdGlvbmlzdFwifVxyXG5cclxuXHRcdFx0ICAgICAgXVxyXG5cdFx0XHQgICAgfVxyXG5cdFx0XHR9XHJcblxyXG5cclxufSk7XHJcbnNob3BpdGVtID0gbmV3IFNpbXBsZVNjaGVtYSh7XHJcblxyXG5cdFx0cGljdHVyZTp7XHJcblx0XHRcdHR5cGU6IFN0cmluZyxcclxuXHRcdFx0bGFiZWw6XCJQYW5uZWF1IGQnZW50w6p0ZVwiLFxyXG5cclxuXHRcdGF1dG9mb3JtOiB7XHJcblx0XHRhZkZpZWxkSW5wdXQ6IHtcclxuXHRcdFx0dHlwZTogXCJjZnMtZmlsZVwiLFxyXG5cdFx0XHRjb2xsZWN0aW9uOiAnYXJ0aWNsZXMnXHJcblx0XHRcdH1cdFxyXG5cdFx0fVxyXG4gfSxcclxuXHRcdHRhZyA6e1xyXG5cdFx0XHRcdHR5cGU6IFN0cmluZyxcclxuXHRcdFx0XHRsYWJlbDpcIkNhdGVnb3JpZVwiLFxyXG5cdFx0XHRcdGFsbG93ZWRWYWx1ZXM6IFsnY29tbXVuYXV0ZScsICdIb3BpdGFsJywgJ2NsaW5pcXVlJyxcImNvbnN1bHRhdGlvblwiLFwicmVnbGVtZW50YXRpb25cIixcInNvaW5zIGFtYnVsYXRvaXJlc1wiLFwic29pbnMgw6AgZG9taWNpbGVcIl0sXHJcblx0XHRcdCAgICBhdXRvZm9ybToge1xyXG5cdFx0XHQgICAgICBvcHRpb25zOiBbXHJcblx0XHRcdCAgICAgICAge2xhYmVsOiBcIkNvbW11bmF1dGVcIiwgdmFsdWU6IFwiY29tbXVuYXV0ZVwifSxcclxuXHRcdFx0ICAgICAgICB7bGFiZWw6IFwiSMO0cGl0YWxcIiwgdmFsdWU6IFwiSG9waXRhbFwifSxcclxuXHRcdFx0XHRcdHtsYWJlbDogXCJDbGluaXF1ZVwiLCB2YWx1ZTogXCJjbGluaXF1ZVwifSxcclxuXHRcdFx0XHRcdHtsYWJlbDogXCJDb25zdWx0YXRpb25cIiwgdmFsdWU6XCJjb25zdWx0YXRpb25cIn0sXHJcblx0XHRcdFx0XHR7bGFiZWw6IFwiU29pbnMgYW1idWxhdG9pcmVzXCIsIHZhbHVlOlwic29pbnMgYW1idWxhdG9pcmVzXCJ9LFxyXG5cdFx0XHRcdFx0e2xhYmVsOiBcIlJlZ2xlbWVudGF0aW9uXCIsIHZhbHVlOlwicmVnbGVtZW50YXRpb25cIn0sXHJcblx0XHRcdFx0XHR7bGFiZWw6IFwiU29pbnMgw6AgZG9taWNpbGVcIiwgdmFsdWU6XCJzb2lucyDDoCBkb21pY2lsZVwifVxyXG5cclxuXHRcdFx0ICAgICAgXVxyXG5cdFx0XHQgICAgfVxyXG5cdFx0XHR9XHJcblxyXG5cclxufSk7XHJcbi8vU2hvcC5fZW5zdXJlSW5kZXgoeyBcImxvY2F0aW9uXCI6IFwiMmRzcGhlcmVcIn0pO1xyXG5TY2hlbWFzLkFkZHJlc3MgPSBuZXcgU2ltcGxlU2NoZW1hKHtcclxuICBsbmc6IHtcclxuICAgIHR5cGUgOiBOdW1iZXIsXHJcbiAgICBkZWNpbWFsOiB0cnVlLFxyXG4gICAgbWluOiAtMTgwLFxyXG4gICAgbWF4OiAxODBcclxuICB9LFxyXG4gIGxhdDoge1xyXG4gICAgdHlwZSA6IE51bWJlcixcclxuICAgIGRlY2ltYWw6IHRydWUsXHJcbiAgICBtaW46IC05MCxcclxuICAgIG1heDogOTBcclxuICB9XHJcbn0pO1xyXG5TaG9wLmF0dGFjaFNjaGVtYSAoIG5ldyBTaW1wbGVTY2hlbWEoe1xyXG5cdHNob3BuYW1lIDp7XHJcblx0XHRcdFx0dHlwZTogU3RyaW5nLFxyXG5cdFx0XHRcdGxhYmVsOlwiTmFtZVwiLFxyXG5cdFx0XHRcdG1heDogMjAwLFxyXG5cdFx0XHRcdGN1c3RvbTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0aWYoKHRoaXMudmFsdWUgfHwgXCJcIikudG9Mb3dlckNhc2UoKSA9PVxyXG5cdFx0XHRcdCh0aGlzLmZpZWxkKFwic2hvcG93bmVyXCIpLnZhbHVlIHx8IFwiXCIpLnRvTG93ZXJDYXNlKCkpIHtcclxuXHRcdFx0XHRyZXR1cm4gXCJzaG9wb3duZXJfc2hvcG5hbWVfc2FtZVwiO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0ICB9XHJcblx0XHRcdH0sXHJcblx0c2hvcG93bmVyIDp7XHJcblx0XHRcdFx0dHlwZTogU3RyaW5nLFxyXG5cdFx0XHRcdGxhYmVsOlwiT3duZXJcIixcclxuICAgICAgICByZWdFeDovXlthLXpBLVotXXsyLDI1fS8sXHJcblx0XHRcdFx0bWF4OiAyMDAsXHJcblx0XHRcdFx0Y3VzdG9tOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRpZigodGhpcy52YWx1ZSB8fCBcIlwiKS50b0xvd2VyQ2FzZSgpID09XHJcblx0XHRcdFx0KHRoaXMuZmllbGQoXCJzaG9wbmFtZVwiKS52YWx1ZSB8fCBcIlwiKS50b0xvd2VyQ2FzZSgpKSB7XHJcblx0XHRcdFx0cmV0dXJuIFwic2hvcG5hbWVfc2hvcG93bmVyX3NhbWVcIjtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0c2hvcGFkcmVzczp7XHJcblx0XHRcdFx0dHlwZTogU3RyaW5nLFxyXG5cdFx0XHRcdGxhYmVsOlwiQWRyZXNzZVwiLFxyXG5cdFx0XHRcdG1heDogMjUwXHJcblx0XHRcdH0sXHJcbiAgcmVnaW9uOiB7IHR5cGU6IFN0cmluZywgbGFiZWw6IFwiUsOpZ2lvblwiIH0sXHJcbiAgdmlsbGU6IHsgdHlwZTogU3RyaW5nLCBsYWJlbDogXCJWaWxsZVwiIH0sXHJcblx0c2hvcHRlbCA6e1xyXG5cdFx0XHRcdHR5cGU6IFN0cmluZyxcclxuICAgICAgICAvLyByZWdFeDovXlxcKD8oWzAtOV17M30pXFwpP1stLiBdPyhbMC05XXszfSlbLS4gXT8oWzAtOV17NH0pJC8sXHJcblx0XHRcdFx0bGFiZWw6XCJQaG9uZVwiXHJcblx0XHRcdH0sXHJcblx0c2hvcG1haWwgOntcclxuICAgICAgICB0eXBlOlN0cmluZyxcclxuICAgICAgICBvcHRpb25hbDogZmFsc2UsXHJcbiAgICAgICAgbGFiZWw6IFwiQWRyZXNzZXMgRW1haWxcIlxyXG4gICAgICB9LFxyXG4gIHNob3Bsb2dvOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgbGFiZWw6XCJsb2dvXCIsXHJcbiAgICAgIGF1dG9mb3JtOiB7XHJcbiAgICAgICAgYWZGaWVsZElucHV0OiB7XHJcbiAgICAgICAgICB0eXBlOiBcImNmcy1maWxlXCIsXHJcbiAgICAgICAgICBjb2xsZWN0aW9uOiAnYXJ0aWNsZXMnLFxyXG4gICAgICAgICAgdXBsb2FkUHJvZ3Jlc3NUZW1wbGF0ZTonTG9hZGluZydcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBzaG9wc3R5bGUgOntcclxuXHRcdFx0XHR0eXBlOiBTdHJpbmcsXHJcblx0XHRcdFx0bGFiZWw6XCJDbGFzc2VcIixcclxuXHRcdFx0XHRhbGxvd2VkVmFsdWVzOiBbJ2hvbW1lcycsICdmZW1tZXMnLCAnZW5mYW50cycsJ21peHRlJ10sXHJcblx0XHRcdCAgICBhdXRvZm9ybToge1xyXG5cdFx0XHQgICAgICBvcHRpb25zOiBbXHJcblx0XHRcdCAgICAgICAge2xhYmVsOiBcIkhvbW1lc1wiLCB2YWx1ZTogXCJob21tZXNcIn0sXHJcblx0XHRcdCAgICAgICAge2xhYmVsOiBcIkZlbW1lc1wiLCB2YWx1ZTogXCJmZW1tZXNcIn0sXHJcblx0XHRcdCAgICAgICAge2xhYmVsOiBcIkVuZmFudHNcIiwgdmFsdWU6IFwiZW5mYW50c1wifSxcclxuXHRcdFx0ICAgICAgICB7bGFiZWw6IFwiTWl4dGVcIiwgdmFsdWU6IFwibWl4dGVcIn1cclxuXHRcdFx0ICAgICAgXVxyXG5cdFx0XHQgICAgfVxyXG5cdFx0XHR9LFxyXG5cdHNob3BzbG9nYW4gOntcclxuXHRcdFx0XHR0eXBlOiBTdHJpbmcsXHJcblx0XHRcdFx0bGFiZWw6XCJTbG9nYW5cIixcclxuXHRcdFx0XHRhdXRvZm9ybTp7XHJcblx0XHRcdFx0XHRwbGFjZWhvbGRlcjogJ1Nob3J0IChsZXNzIHRoYW4gMTAwIGNoYXJhY3RlcnMpJyxcclxuICAgICAgXHRcdFx0XHRyb3dzOiAzXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG4gICAgICBnYXJkZToge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZyxcclxuXHRcdFx0XHRsYWJlbDpcIkdhcmRlXCIsXHJcblx0XHRcdFx0YWxsb3dlZFZhbHVlczogWydvdWknLCAnbm9uJ10sXHJcblx0XHRcdCAgICBhdXRvZm9ybToge1xyXG5cdFx0XHQgICAgICBvcHRpb25zOiBbXHJcblx0XHRcdCAgICAgICAge2xhYmVsOiBcIk9VSVwiLCB2YWx1ZTogXCJvdWlcIn0sXHJcblx0XHRcdCAgICAgICAge2xhYmVsOiBcIk5PTlwiLCB2YWx1ZTogXCJub25cIn1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG5cclxuICBzaG9wVGVhbSA6e1xyXG4gICAgXHRcdFx0XHR0eXBlOiBbdGVhbU1iZXJdLFxyXG4gICAgXHRcdFx0XHRsYWJlbDpcIkVxdWlwZVwiLFxyXG4gICAgICAgICAgICBvcHRpb25hbDp0cnVlXHJcbiAgICBcdFx0XHR9LFxyXG5cclxuXHJcblx0c2hvcGl0ZW1zIDp7XHJcblx0XHRcdFx0dHlwZTogW3Nob3BpdGVtXSxcclxuXHRcdFx0XHRsYWJlbDpcIkl0ZW1zXCJcclxuXHRcdFx0fSxcclxuXHJcblx0Y3JlYXRlZEJ5OiB7XHJcblx0XHRcdFx0dHlwZTogU3RyaW5nLFxyXG5cdFx0XHRcdGxhYmVsOiBcIkNyZWF0ZWQgQnlcIixcclxuXHRcdFx0XHRhdXRvVmFsdWU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGlmICh0aGlzLmlzSW5zZXJ0KSB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMudXNlcklkO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0YXV0b2Zvcm06IHtcclxuXHRcdFx0XHR0eXBlOlwiaGlkZGVuXCJcclxuXHRcdFx0fVxyXG5cdH0sXHJcblx0Y3JlYXRlZEF0OiB7XHJcblx0XHRcdFx0dHlwZTogRGF0ZSxcclxuXHRcdFx0XHRsYWJlbDogXCJDcmVhdGVkIEF0XCIsXHJcblx0XHRcdFx0YXV0b1ZhbHVlOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRpZiAodGhpcy5pc0luc2VydCkge1xyXG5cdFx0XHRcdHJldHVybiBuZXcgRGF0ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdGF1dG9mb3JtOiB7XHJcblx0XHRcdFx0dHlwZTpcImhpZGRlblwiXHJcblx0XHRcdH1cclxuXHR9LFxyXG5cdHVwZGF0ZWRBdDoge1xyXG5cdFx0XHRcdHR5cGU6IERhdGUsXHJcblx0XHRcdFx0bGFiZWw6IFwiVXBkYXRlZCBBdFwiLFxyXG5cdFx0XHRcdGF1dG9WYWx1ZTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMuaXNVcGRhdGUpIHtcclxuXHRcdFx0XHRyZXR1cm4gbmV3IERhdGUoKTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdFx0YXV0b2Zvcm06IHtcclxuXHRcdFx0XHR0eXBlOlwiaGlkZGVuXCJcclxuXHRcdFx0fSxcclxuXHRcdFx0ZGVueUluc2VydDogdHJ1ZSxcclxuXHRcdFx0b3B0aW9uYWw6IHRydWVcclxuXHR9LFxyXG5cdGxvY2F0aW9uOiB7XHJcblx0XHQgICAgdHlwZTogU2NoZW1hcy5BZGRyZXNzLFxyXG5cdFx0ICAgIGF1dG9mb3JtOiB7XHJcblx0XHQgICAgICBsYWJlbDogZmFsc2UsXHJcblx0XHQgICAgICBwbGFjZWhvbGRlcjogXCJBZGRyZXNzXCJcclxuXHRcdCAgICB9XHJcbiAgXHRcdH0sXHJcbiAgXHR1cHZvdGVyczp7XHJcbiAgXHRcdHR5cGU6U3RyaW5nLFxyXG5cclxuXHRcdGF1dG9WYWx1ZTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMuaXNJbnNlcnQpIHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy51c2VySWQ7XHJcblx0XHRcdH1lbHNlIHtcclxuXHRcdFx0XHRpZiAodGhpcy5pc1VwZGF0ZSkge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLnVzZXJJZDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcbiAgXHRcdGF1dG9mb3JtOntcclxuXHRcdFx0XHR0eXBlOlwiaGlkZGVuXCJcclxuXHRcdFx0fVxyXG5cdCAgXHR9ICxcclxuICBcdHZvdGVzOiB7XHJcbiAgXHRcdHR5cGU6TnVtYmVyLFxyXG4gIFx0XHRsYWJlbDogXCJMaWtlXCIsXHJcbiAgXHRcdGRlZmF1bHRWYWx1ZTonMCcsXHJcblx0ICBcdGF1dG9mb3JtOntcclxuXHRcdFx0XHR0eXBlOlwiaGlkZGVuXCJcclxuXHRcdH1cclxuXHJcblx0ICB9XHJcblxyXG59KSk7XHJcblNob3AuYXR0YWNoU2NoZW1hIChTY2hlbWFzLnNob3ApO1xyXG4vL3JlY2hlcmNoZSBkZSBzaG9wcGluZ1xyXG5TY2hlbWFzLlNlYXJjaCA9IG5ldyBTaW1wbGVTY2hlbWEoe1xyXG5cdFx0ICBsb2NhdGlvbjoge1xyXG5cdFx0ICAgIHR5cGU6IFNjaGVtYXMuQWRkcmVzcyxcclxuXHRcdCAgICBhdXRvZm9ybToge1xyXG5cdFx0ICAgICAgbGFiZWw6IGZhbHNlLFxyXG5cdFx0ICAgICAgcGxhY2Vob2xkZXI6IFwiQWRkcmVzc1wiXHJcblx0XHQgICAgfVxyXG5cdFx0ICB9LFxyXG5cdFx0ICByYWRpdXM6IHtcclxuXHRcdCAgICB0eXBlOiBOdW1iZXIsXHJcblx0XHQgICAgYXV0b2Zvcm06IHtcclxuXHRcdCAgICAgIGxhYmVsOiBmYWxzZSxcclxuXHRcdCAgICAgIHBsYWNlaG9sZGVyOiBcIlJhZGl1cyAoa20pXCJcclxuXHRcdCAgICB9XHJcblx0XHQgIH1cclxufSk7XHJcblxyXG4vL0NhcmRzX29wZW4gY29sbGVjdGlvbiBwZXJtaXNzaW9uXHJcbkNhcmRzX29wZW4gPSBuZXcgTW9uZ28uQ29sbGVjdGlvbignb3BlbicpO1xyXG5cclxuQ2FyZHNfb3Blbi5hbGxvdyh7XHJcblx0aW5zZXJ0IDogZnVuY3Rpb24odXNlcklkLGRvYyl7XHJcblx0cmV0dXJuIHRydWU7XHJcblx0fSxcclxuXHR1cGRhdGUgOiBmdW5jdGlvbih1c2VySWQsZG9jLGZpZWxkTmFtZXMsbW9kaWZpZXIpe1xyXG5cdHJldHVybiB0cnVlO1xyXG5cdH0sXHJcblx0cmVtb3ZlIDogZnVuY3Rpb24odXNlcklkLGRvYyl7XHJcblx0cmV0dXJuIHRydWU7XHJcblx0fSxcclxuXHQgIGZldGNoOiBbJ293bmVyJ11cclxufSk7XHJcbi8vY29tbWVudHMgY29sbGVjdGlvbiBjb250cm9sbGVyXHJcblxyXG5Db21tZW50cyA9IG5ldyBNb25nby5Db2xsZWN0aW9uKCdjb21tZW50Jyk7XHJcblxyXG5Db21tZW50cy5hbGxvdyh7XHJcblxyXG5pbnNlcnQgOiBmdW5jdGlvbih1c2VySWQsZG9jKXtcclxucmV0dXJuIHRydWU7XHJcbn0sXHJcbnVwZGF0ZSA6IGZ1bmN0aW9uKHVzZXJJZCxkb2MsZmllbGROYW1lcyxtb2RpZmllcil7XHJcbnJldHVybiB0cnVlO1xyXG59LFxyXG5yZW1vdmUgOiBmdW5jdGlvbih1c2VySWQsZG9jKXtcclxucmV0dXJuIHRydWU7XHJcbn0sXHJcbiAgZmV0Y2g6IFsnb3duZXInXVxyXG59KTtcclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL2dvb2dsZW1hcFxyXG4vKnZhciBQb3N0ID0gQmFzZU1vZGVsLmV4dGVuZEFuZFNldHVwQ29sbGVjdGlvbihcInBvc3RzXCIpO1xyXG5cclxuTGlrZWFibGVNb2RlbC5tYWtlTGlrZWFibGUoUG9zdCwgXCJwb3N0XCIpO1xyXG5cclxuXHJcbnZhciBTaG9wbGlrZSA9IEJhc2VNb2RlbC5leHRlbmRBbmRTZXR1cENvbGxlY3Rpb24oXCJTaG9wXCIpO1xyXG5cclxuTGlrZWFibGVNb2RlbC5tYWtlTGlrZWFibGUoU2hvcGxpa2UsIFwic2hvcGxpa2VcIik7Ki9cclxuXHJcblxyXG4vL1Byb2R1Y3RkYXRhIHBlcm1pc3Npb25cclxuIiwiaW1wb3J0IHsgTW9uZ28gfSBmcm9tICdtZXRlb3IvbW9uZ28nO1xuXG5leHBvcnQgY29uc3QgVXNlckhpc3RvcnkgPSBuZXcgTW9uZ28uQ29sbGVjdGlvbigndXNlckhpc3RvcnknKTtcblxuU2NoZW1hcyA9IHt9O1xuXG5Vc2VySGlzdG9yeS5hbGxvdyh7XG5cbiAgICBpbnNlcnQgOiBmdW5jdGlvbih1c2VySWQsZG9jKXtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIHVwZGF0ZSA6IGZ1bmN0aW9uKHVzZXJJZCxkb2MsZmllbGROYW1lcyxtb2RpZmllcil7XG4gICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICByZW1vdmUgOiBmdW5jdGlvbih1c2VySWQsZG9jKXtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgICAgZmV0Y2g6IFsnb3duZXInXVxuICAgIH0pOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cblVzZXJIaXN0b3J5LnNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICB1c2VySWQ6IHt0eXBlOiBTdHJpbmd9LFxuICBjYWxsZWRQZXJzb25uZWw6IHsgdHlwZTogTnVtYmVyLCBkZWZhdWx0VmFsdWU6IDAsIG9wdGlvbmFsOiB0cnVlIH0sXG4gIGNhbGxlZEZhY2lsaXR5OiB7IHR5cGU6IE51bWJlciwgZGVmYXVsdFZhbHVlOiAwLCBvcHRpb25hbDogdHJ1ZSB9LFxuICB2aXNpdGVkUGhhcm1hY3k6IHsgdHlwZTogTnVtYmVyLCBkZWZhdWx0VmFsdWU6IDAsIG9wdGlvbmFsOiB0cnVlIH0sXG4gIHNlYXJjaGVkRHJ1ZzogeyB0eXBlOiBOdW1iZXIsIGRlZmF1bHRWYWx1ZTogMCwgb3B0aW9uYWw6IHRydWUgfSxcbiAgY29tcGFyZWRQcmljZXM6IHsgdHlwZTogTnVtYmVyLCBkZWZhdWx0VmFsdWU6IDAgLG9wdGlvbmFsOiB0cnVlIH0sXG4gIGxhc3RVcGRhdGVkOiB7IHR5cGU6IERhdGUsIG9wdGlvbmFsOiB0cnVlIH1cbn0pO1xuXG5Vc2VySGlzdG9yeS5hdHRhY2hTY2hlbWEoVXNlckhpc3Rvcnkuc2NoZW1hKTtcbiIsImltcG9ydCB7IE1vbmdvIH0gZnJvbSAnbWV0ZW9yL21vbmdvJztcclxuXHJcbmV4cG9ydCBjb25zdCBWaXNpdHMgPSBuZXcgTW9uZ28uQ29sbGVjdGlvbigndmlzaXRzJyk7XHJcblxyXG5jb25zdCBWaXNpdHNTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcclxuICBpcDoge1xyXG4gICAgdHlwZTogU3RyaW5nLFxyXG4gICAgbGFiZWw6IFwiQWRyZXNzZSBJUFwiLFxyXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5JUCxcclxuICAgIG9wdGlvbmFsOiB0cnVlLFxyXG4gIH0sXHJcbiAgZGF0ZToge1xyXG4gICAgdHlwZTogRGF0ZSxcclxuICAgIGxhYmVsOiBcIkRhdGUgZGUgbGEgdmlzaXRlXCIsXHJcbiAgICBvcHRpb25hbDogdHJ1ZSxcclxuICB9LFxyXG4gIHBhdGg6IHtcclxuICAgIHR5cGU6IFN0cmluZyxcclxuICAgIGxhYmVsOiBcIlVSTCB2aXNpdMOpZVwiLFxyXG4gICAgb3B0aW9uYWw6IHRydWUsXHJcbiAgfSxcclxuICB1c2VyQWdlbnQ6IHtcclxuICAgIHR5cGU6IFN0cmluZyxcclxuICAgIGxhYmVsOiBcIkFnZW50IHV0aWxpc2F0ZXVyXCIsXHJcbiAgICBvcHRpb25hbDogdHJ1ZSxcclxuICB9LFxyXG4gIGNvdW50OiB7XHJcbiAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICBsYWJlbDogXCJOb21icmUgZGUgdmlzaXRlc1wiLFxyXG4gICAgZGVmYXVsdFZhbHVlOiAxLFxyXG4gICAgb3B0aW9uYWw6IHRydWUsXHJcbiAgfSxcclxuICBkYXk6IHtcclxuICAgIHR5cGU6IFN0cmluZyxcclxuICAgIHJlZ0V4OiAvXlxcZHs0fS1cXGR7Mn0tXFxkezJ9JC8gLy8gZm9ybWF0IElTTyA4NjAxIDogXCIyMDI1LTA4LTA2XCJcclxuICB9LFxyXG59KTtcclxuXHJcblZpc2l0cy5hdHRhY2hTY2hlbWEoVmlzaXRzU2NoZW1hKTtcclxuIl19
