import { UserHistory } from '/collections/userHistory.js';
Meteor.methods({
  'userHistory.increment'(userId, type) {
    check(userId, String);
    check(type, String);
    
    const validTypes = ['calledPersonnel', 'calledFacility', 'visitedPharmacy', 'searchedDrug', 'comparedPrices'];
    //if (!validTypes.includes(type)) throw new Meteor.Error('Invalid type');

    UserHistory.update(
      { userId },
      {
        $inc: { [type]: 1 },
        $set: { lastUpdated: new Date() }
      },
      { upsert: true }
    );
  }
});

