import { Template } from 'meteor/templating';
import './voiceRecognition.html';
/* this.maliste = new ReactiveVar([]);
this.infliste = new ReactiveVar([]);
this.etabliste = new ReactiveVar([]); */

Template.voiceRecognition.onCreated(function () {
  this.results = new ReactiveVar([]);
/* 
  maliste.set(Shop.find({}, { sort: { createdAt: -1 } }));
  infliste.set(AideSoignants.find({}, { sort: { createdAt: -1 } }));
  etabliste.set(Etablissements.find({}, { sort: { createdAt: -1 } })); */
});

Template.voiceRecognition.helpers({
  results() {
    return Template.instance().results.get();
  }
  /* ,
  hasItem() {
    return maliste.get().count();
  },
  hasInf() {
    return infliste.get().count();
  },
  hasEtab() {
    return etabliste.get().count();
  } */
});

Template.voiceRecognition.onRendered(function () {
  const instance = this;

  const resultDiv   = instance.find('#voice-result');
  const startBtn    = instance.find('#start-rec');
  const resultShop  = instance.find('#pharmacies');
  const resultPerso = instance.find('#personnelSoignant');
  const resultForm  = instance.find('#etablissementSanitaire');

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    resultDiv.textContent = "Votre navigateur ne supporte pas la reconnaissance vocale.";
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'fr-FR';
  recognition.continuous = false;
  recognition.interimResults = false;

  startBtn.addEventListener('click', () => {
    recognition.start();
    resultDiv.textContent = "🎙️ Écoute en cours...";
  });

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    resultDiv.textContent = transcript;

    if (transcript.includes("pharmacie")) {
      Meteor.call("searchPharmacy", (err, res) => {
        if (!err) instance.results.set(res);
        if (resultPerso) resultPerso.style.display = "none";
        if (resultForm) resultForm.style.display = "none";
        if (resultShop) resultShop.style.display = "block";
      });
    } 
    else if (transcript.includes("personnel de santé") || transcript.includes("médecin") || transcript.includes("infirmier")) {
      Meteor.call("searchHealthPersonnel", (err, res) => {
        if (!err) instance.results.set(res);
        if (resultShop) resultShop.style.display = "none";
        if (resultForm) resultForm.style.display = "none";
        if (resultPerso) resultPerso.style.display = "block";
      });
    } 
    else if (transcript.includes("formation sanitaire") || transcript.includes("hôpital") || transcript.includes("clinique")) {
      Meteor.call("searchHealthFacility", (err, res) => {
        if (!err) instance.results.set(res);
        if (resultPerso) resultPerso.style.display = "none";
        if (resultShop) resultShop.style.display = "none";
        if (resultForm) resultForm.style.display = "block";
      });
    }
    else if (transcript.includes("medicaments")) {
      Meteor.call("searchDrugs", (err, res) => {
        if (!err) instance.results.set(res);
      });
    }  
    else if (transcript.includes("Comparaison du prix") || transcript.includes("Medicament similaire") || transcript.includes("produit equivalent")) {
      Meteor.call("comparemedoc", (err, res) => {
        if (!err) instance.results.set(res);
      });
    } 
    else {
      resultDiv.textContent = "Commande non reconnue.";
      instance.results.set([]);
    }

    Meteor.call("saveSpeechText", transcript);
  };

  recognition.onerror = (event) => {
    console.error("Erreur:", event.error);
    resultDiv.textContent = "Erreur de reconnaissance.";
  };
});
