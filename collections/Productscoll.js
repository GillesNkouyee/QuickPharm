Productdata = new Mongo.Collection('productdata');
 
Productdata.allow({

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
//  Productdata.attachSchema ( new SimpleSchema({
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
