Template.newnav1.onRendered(function () {
  // Init tooltips Bootstrap si encore utilisés
  $('[data-toggle="tooltip"]').tooltip();

  // Init sidebar Semantic UI
  $('.ui.sidebar').sidebar({
    transition: 'overlay',
    dimPage: false
  });
 
  // Toggle avec bouton hamburger
  $('.openbtn').on('click', function () {
    $('.ui.sidebar').sidebar('toggle');
  });
 /*  $('#myCartModal1').modal({
    autofocus: false
  }); */
});
Template.newnav1.helpers({
  profilepic: function() {
		return Meteor.users.findOne(Meteor.userId()).profile.avatar_url
		},
    name: function() {
    return Meteor.users.findOne(Meteor.userId()).profile.name
  }
});

Template.newnav1.events({
  'click #logout'(e) {
    e.preventDefault();
    Meteor.logout();
  }
});
