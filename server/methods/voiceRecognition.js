
import { Meteor } from 'meteor/meteor';

Meteor.methods({
  saveSpeechText(text) {
    console.log("Texte reconnu :", text);
    // Ici, tu peux stocker dans MongoDB ou analyser le texte
  },
   searchPharmacy() {
    console.log("🔍 Recherche de pharmacies...");
    // Ici tu peux lancer une recherche en base MongoDB
    return Shop.find().fetch();
  },
  searchHealthPersonnel() {
    console.log("🔍 Recherche de personnels de santé...");
    return AideSoignants.find().fetch();
  },
  searchHealthFacility() {
    console.log("🔍 Recherche de formations sanitaires...");
    return Etablissements.find().fetch();
  },
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
});

Meteor.startup(() => {
  console.log("Serveur Meteor démarré avec reconnaissance vocale.");
});
