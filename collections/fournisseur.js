
Fournisseurs = new Mongo.Collection('fournisseurs');
Fournisseurs.allow({

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
              type:String,
              regEx:/^[a-zA-Z-]{2,25}/,
              optional:true,
              label:"Phone Number"
        },
  adress:{
      type: String,
      label:"Adresse",
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
               return new Date;
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
        autoValue: function() {
            if (this.isUpdate) {
                return new Date;
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
        autoValue: function() {
            if (this.isInsert) {
                return Meteor.userId();
            } else {
                this.unset();
            }
        }
    }
}));
Fournisseurs.attachSchema (Schemas.Fournisseurs);
