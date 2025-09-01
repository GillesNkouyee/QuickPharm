AideSoignants = new Mongo.Collection('aideSoignants');

Schemas = {};

AideSoignants.allow({

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
    
AideSoignants.schema = new SimpleSchema({
  nom: { type: String },
  prenom: { type: String },
  specialite: { type: String },
  telephone: { type: String },
  region: { type: String, label: "Région" },
  ville: { type: String, label: "Ville" },
  quartier: { type: String, optional: true, label: "Quartier" },
  localisation: {
    type: Object,
    optional: true
  },
  'localisation.lat': {
    type: Number,
    label: "Latitude",
    decimal: true,
    autoform: { step: 0.000001 }
  },
  'localisation.lng': {
    type: Number,
    label: "Longitude",
    decimal: true,
    autoform: { step: 0.000001 }
  },
  disponible: { type: Boolean, defaultValue: true },
  dernierAppel: { type: Date, optional: true },
  
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
      if (this.isInsert) return new Date;
    },
    autoform: { type: "hidden" }
  },
  addedBy: {
    type: String,
    label: "Created By",
    autoValue: function () {
      if (this.isInsert) return this.userId;
    },
    autoform: { type: "hidden" }
  },
  updatedAt: {
    type: Date,
    label: "Updated At",
    autoValue: function () {
      if (this.isUpdate) return new Date();
    },
    autoform: { type: "hidden" },
    denyInsert: true,
    optional: true
  },
});


AideSoignants.attachSchema(AideSoignants.schema);
