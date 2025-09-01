Template.navbar.onRendered(function(){
  $('.ui.dropdown').dropdown();
});
Template.navbar.events({
	'click #logout':function(){
		Meteor.logout();
		// Router.go('Home');
	}
});
////////////////////affichage des avatars et gestion des profiles utilisateurs////////////////////
Template.navbar.helpers({
  profilepic: function() {
		return Meteor.users.findOne(Meteor.userId()).profile.avatar_url
		},
    name: function() {
    return Meteor.users.findOne(Meteor.userId()).profile.name
  }
});
