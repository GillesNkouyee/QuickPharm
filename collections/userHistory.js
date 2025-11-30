import { Mongo } from 'meteor/mongo';

export const UserHistory = new Mongo.Collection('userHistory');

Schemas = {};

UserHistory.allow({

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

UserHistory.schema = new SimpleSchema({
  userId: {type: String},
  calledPersonnel: { type: Number, defaultValue: 0, optional: true },
  calledFacility: { type: Number, defaultValue: 0, optional: true },
  visitedPharmacy: { type: Number, defaultValue: 0, optional: true },
  searchedDrug: { type: Number, defaultValue: 0, optional: true },
  comparedPrices: { type: Number, defaultValue: 0 ,optional: true },
  lastUpdated: { type: Date, optional: true }
});

UserHistory.attachSchema(UserHistory.schema);
