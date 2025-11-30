//import d3 from 'd3';


Template.mystoryview.onCreated(function() { 
  this.subscribe('userHistory');
});

Template.mystoryview.helpers({
    name: function() {
        return Meteor.users.findOne(Meteor.userId()).profile.name
      },
    history() {
    return UserHistory.findOne({ userId: Meteor.userId() });
  } 
});
Template.mystoryview.events({
 
});
Template.mystoryview.onRendered(function() {   
 
});