import { Visits } from '/collections/visits.js';
Meteor.methods({
  'visits.track'() {
    const today = new Date();
    const dateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    const visit = Visits.findOne({ date: dateOnly});

    if (visit){
      Visits.update(visit._id, {$inc: { count: 1}});
    }else {
      Visits.insert({ date: dateOnly, count: 1});
    }
  }
});
Meteor.methods({
  'logVisit'() {
    const today = new Date();
    const day = today.toISOString().split('T')[0];

    Visits.upsert(
      { day },
      { $inc: { count: 1 } }
    );
  }
});