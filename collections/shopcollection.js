
shop = "Shop";
Shop = new Mongo.Collection('shop');
Meteor.startup(function() {
  //Shop._ensureIndex({"location.geometry": "2dsphere"});
});
Schemas = {};
//Shop collection permission
Shop.allow({

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

//Shop autoform with a shopitem autorm included
// Teammember SimpleSchema
teamMber = new SimpleSchema({
    Nom:{
				  type: String,
				  label:"Nom",
          regEx:/^[a-zA-Z-]{2,25}/
    },
    Prenom:{
				  type: String,
				  label:"Prenom",
          regEx:/^[a-zA-Z-]{2,25}/
    },
		photo:{
				  type: String,
				  label:"Photo",

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
              type:String,
              optional:true,
              label:"Biographie",
              autoform: {
                afFieldInput:{
                  type:"textarea"
                }
              }
            },
		Poste :{
				type: String,
				label:"Fonction",
				allowedValues: ['Pharmacien', 'Caissier', 'Receptionist'],
			    autoform: {
			      options: [
			        {label: "Pharmacien", value: "Pharmacien"},
			        {label: "Caissier(e)", value: "Caissier"},
			        {label: "Receptionist(e)", value: "Receptionist"}

			      ]
			    }
			}


});
shopitem = new SimpleSchema({

		picture:{
			type: String,
			label:"Panneau d'entête",

		autoform: {
		afFieldInput: {
			type: "cfs-file",
			collection: 'articles'
			}	
		}
 },
		tag :{
				type: String,
				label:"Categorie",
				allowedValues: ['communaute', 'Hopital', 'clinique',"consultation","reglementation","soins ambulatoires","soins à domicile"],
			    autoform: {
			      options: [
			        {label: "Communaute", value: "communaute"},
			        {label: "Hôpital", value: "Hopital"},
					{label: "Clinique", value: "clinique"},
					{label: "Consultation", value:"consultation"},
					{label: "Soins ambulatoires", value:"soins ambulatoires"},
					{label: "Reglementation", value:"reglementation"},
					{label: "Soins à domicile", value:"soins à domicile"}

			      ]
			    }
			}


});
//Shop._ensureIndex({ "location": "2dsphere"});
Schemas.Address = new SimpleSchema({
  lng: {
    type : Number,
    decimal: true,
    min: -180,
    max: 180
  },
  lat: {
    type : Number,
    decimal: true,
    min: -90,
    max: 90
  }
});
Shop.attachSchema ( new SimpleSchema({
	shopname :{
				type: String,
				label:"Name",
				max: 200,
				custom: function() {
				if((this.value || "").toLowerCase() ==
				(this.field("shopowner").value || "").toLowerCase()) {
				return "shopowner_shopname_same";
				}
			  }
			},
	shopowner :{
				type: String,
				label:"Owner",
        regEx:/^[a-zA-Z-]{2,25}/,
				max: 200,
				custom: function() {
				if((this.value || "").toLowerCase() ==
				(this.field("shopname").value || "").toLowerCase()) {
				return "shopname_shopowner_same";
					}
				}
			},
	shopadress:{
				type: String,
				label:"Adresse",
				max: 250
			},
  region: { type: String, label: "Région" },
  ville: { type: String, label: "Ville" },
	shoptel :{
				type: String,
        // regEx:/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
				label:"Phone"
			},
	shopmail :{
        type:String,
        optional: false,
        label: "Adresses Email"
      },
  shoplogo: {
      type: String,
      label:"logo",
      autoform: {
        afFieldInput: {
          type: "cfs-file",
          collection: 'articles',
          uploadProgressTemplate:'Loading'
        }
      }
    },
    shopstyle :{
				type: String,
				label:"Classe",
				allowedValues: ['hommes', 'femmes', 'enfants','mixte'],
			    autoform: {
			      options: [
			        {label: "Hommes", value: "hommes"},
			        {label: "Femmes", value: "femmes"},
			        {label: "Enfants", value: "enfants"},
			        {label: "Mixte", value: "mixte"}
			      ]
			    }
			},
	shopslogan :{
				type: String,
				label:"Slogan",
				autoform:{
					placeholder: 'Short (less than 100 characters)',
      				rows: 3
				}
			},
      garde: {
        type: String,
				label:"Garde",
				allowedValues: ['oui', 'non'],
			    autoform: {
			      options: [
			        {label: "OUI", value: "oui"},
			        {label: "NON", value: "non"}
                ]
              }
          },

  shopTeam :{
    				type: [teamMber],
    				label:"Equipe",
            optional:true
    			},


	shopitems :{
				type: [shopitem],
				label:"Items"
			},

	createdBy: {
				type: String,
				label: "Created By",
				autoValue: function() {
				if (this.isInsert) {
				return this.userId;
			}
		},
		autoform: {
				type:"hidden"
			}
	},
	createdAt: {
				type: Date,
				label: "Created At",
				autoValue: function() {
				if (this.isInsert) {
				return new Date;
			}
		},
		autoform: {
				type:"hidden"
			}
	},
	updatedAt: {
				type: Date,
				label: "Updated At",
				autoValue: function() {
				if (this.isUpdate) {
				return new Date();
			}
		},
			autoform: {
				type:"hidden"
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
  	upvoters:{
  		type:String,

		autoValue: function() {
				if (this.isInsert) {
				return this.userId;
			}else {
				if (this.isUpdate) {
				return this.userId;
				}
			}
		},
  		autoform:{
				type:"hidden"
			}
	  	} ,
  	votes: {
  		type:Number,
  		label: "Like",
  		defaultValue:'0',
	  	autoform:{
				type:"hidden"
		}

	  }

}));
Shop.attachSchema (Schemas.shop);
//recherche de shopping
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
});

//Cards_open collection permission
Cards_open = new Mongo.Collection('open');

Cards_open.allow({
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
//comments collection controller

Comments = new Mongo.Collection('comment');

Comments.allow({

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

/////////////////////////////////////////////googlemap
/*var Post = BaseModel.extendAndSetupCollection("posts");

LikeableModel.makeLikeable(Post, "post");


var Shoplike = BaseModel.extendAndSetupCollection("Shop");

LikeableModel.makeLikeable(Shoplike, "shoplike");*/


//Productdata permission
