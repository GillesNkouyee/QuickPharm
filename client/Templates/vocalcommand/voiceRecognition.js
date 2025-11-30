import { Template } from 'meteor/templating';
import './voiceRecognition.html';



Template.voiceRecognition.onCreated(function () {
  this.results = new ReactiveVar([]);
  this.activeType = new ReactiveVar(null); // pour savoir quel type afficher
});

Template.voiceRecognition.helpers({
  results() {
    return Template.instance().results.get();
  },
  isPharmacy() {
    return Template.instance().activeType.get() === "pharmacy";
  },
  isPersonnel() {
    return Template.instance().activeType.get() === "personnel";
  },
  isFacility() {
    return Template.instance().activeType.get() === "facility";
  },
  isDrug() {
    return Template.instance().activeType.get() === "drug";
  }
});

Template.voiceRecognition.onRendered(function () {
  const instance = this;
  const resultDiv = instance.find('#voice-result');
  const startBtn = instance.find('#start-rec');
  const stopBtn = instance.find('#stop-rec');

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
  stopBtn.addEventListener('click', () => {
    console.log("🛑 Reconnaissance vocale arrêtée.");
    $("#voice-result").hide();
  });
  
  function extractDrugName(transcript) {
  // mots qu’on veut ignorer
  const stopWords = [
    "médicament", "médicaments", "je", "veux", "acheter", "rechercher",
    "donne", "moi", "trouve", "trouver", "un", "une", "du", "de", "le", "la" 
  ];

  let words = transcript.toLowerCase().split(/\s+/);

  // filtre les mots parasites
  let filtered = words.filter(w => !stopWords.includes(w));

  // on recompose la phrase utile
  return filtered.join(" ").trim();
}

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    resultDiv.textContent = transcript;

    if (transcript.includes("pharmacie")) {
      Meteor.call("searchPharmacy", (err, res) => {
        if (!err) {
          instance.results.set(res);
          instance.activeType.set("pharmacy");
        }
      });
    } 
    else if (transcript.includes("personnel de santé") || transcript.includes("médecin") || transcript.includes("infirmier")
    
    || transcript.includes("urgentiste") || transcript.includes("sage femme") || transcript.includes("dentiste") || transcript.includes("anesthesiste")
    
    
    ) {
      Meteor.call("searchHealthPersonnel", (err, res) => {
        if (!err) {
          instance.results.set(res);
          instance.activeType.set("personnel");
        }
      });
    } 
    else if (transcript.includes("formation sanitaire") || transcript.includes("hôpital") || transcript.includes("clinique")) {
      Meteor.call("searchHealthFacility", (err, res) => {
        if (!err) {
          instance.results.set(res);
          instance.activeType.set("facility");
        }
      });
    }
    else if (transcript.includes("médicament") || transcript.includes("médicaments")) {
    let drugName = extractDrugName(transcript);
    console.log("🧪 Nom extrait du médicament :", drugName);

    Meteor.call("searchDrugs", drugName, (err, res) => {
      if (!err) {
        instance.results.set(res);
        instance.activeType.set("drug");
      } else {
        console.error("Erreur recherche médicament:", err);
        alert("Je n'arrive pas à trouver les medocs");
      }
    });
  }
    else {
      resultDiv.textContent = "Commande non reconnue.";
      instance.results.set([]);
      instance.activeType.set(null);
    }

    Meteor.call("saveSpeechText", transcript);
  };

  recognition.onerror = (event) => {
    console.error("Erreur:", event.error);
    resultDiv.textContent = "Erreur de reconnaissance.";
  };
});
