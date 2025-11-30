
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
  }
});

Meteor.methods({
  searchDrugs(voiceInput) {
    check(voiceInput, String);

    console.log("🎤 Commande vocale reçue :", voiceInput);

    if (!voiceInput || voiceInput.trim() === "") {
      return Productdata.find({}).fetch();
    }

    // découper les mots
    const words = voiceInput.trim().split(/\s+/);

    let filters = {};

    // Cherche si un mot correspond à la marque (brand)
    if (words.length > 0) {
      filters.brand = { $regex: words.join(" "), $options: "i" }; 
    }

    // Cherche si un mot correspond à un numéro de labo
    const lab = words.find(w => /^\d+/.test(w));
    if (lab) {
      filters.lab = { $regex: lab, $options: "i" };
    }

    console.log("📝 Filtres appliqués :", filters);

    return Productdata.find(filters).fetch();
  }
});


Meteor.startup(() => {
  console.log("Serveur Meteor démarré avec reconnaissance vocale.");
});
