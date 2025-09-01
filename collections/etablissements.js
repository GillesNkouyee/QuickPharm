const { Select } = require("semantic-ui-react");

Etablissements = new Mongo.Collection('etablissements');

Etablissements.allow({

    insert : function(userId,doc){
    return true;
    },
    update : function(userId,doc,fieldNames,modifier){
    return true;
    },
    remove : function(userId,doc){
    return true;
    },
      fetch: ['owner']
    });
    Schemas = {};

Etablissements.attachSchema(new SimpleSchema({
  nom: {
    type: String,
    label: "Nom de l'établissement",
  },
  type: {
    type: String,
    allowedValues: [
      "Hôpital général",
      "Hôpital central",
      "Hôpital de district",
      "Clinique",
      "Centre de santé",
      "Dispensaire",
      "Laboratoire d’analyses",
      "Centre de diagnostic",
      "Centre de santé intégré",
      "Hôpital de district",
      "Centre d’imagerie",
      "Centre ophtalmologique",
      "Centre de Maternité",
      "Centre de Gynécologie",
      "Centre Pédiatrique",
      "Cabinet médical",
      "Cabinet dentaire",
      "Centre de rééducation",
      "Autre"
    ],
    label: "Type d'établissement",
  },
  region: {
    type: String,
    label: "Région",
  },
  ville: {
    type: String,
    label: "Ville",
  },
  quartier: {
    type: String,
    optional: true,
    label: "Quartier",
  },
  adresse: {
    type: String,
    optional: true,
    label: "Adresse complète",
  },
  localisation: {
    type: Object,
    optional: true
  },
  'localisation.lat': { type: Number,
    label: "Latitude",
    decimal: true,
    autoform: {
      step: 0.000001
    }
  },
  'localisation.lng': { type: Number,
    label: "Longitude",
    decimal: true,
    autoform: {
      step: 0.000001
    }
  },
  telephone: {
    type: String,
    optional: true,
    label: "Téléphone",
  },
  email: {
    type: String,
    optional: true,
    regEx: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    label: "Email",
  },
  siteWeb: {
    type: String,
    optional: true,
    label: "Site Web",
  },
  dateAjout: {
    type: Date,
    defaultValue: new Date(),
    label: "Date d'ajout",
  },
}));

Etablissements.attachSchema(Schemas.Etablissements);
