
Tracker.autorun(function() {

	Meteor.subscribe("shop");
});
Tracker.autorun(function() {
Meteor.subscribe("open");
});
Meteor.subscribe("fsrList");
/*Meteor.subscribe("post",7);Router.current().params._id*/

Tracker.autorun(function() {
Meteor.subscribe('updateshop');
});
Meteor.subscribe('comments');
Meteor.subscribe('productdata');
Meteor.subscribe('userProfile');
Tracker.autorun(function() {
Meteor.subscribe("images");
});
Meteor.subscribe('shopSearch');
Meteor.subscribe("navbar",this.userId);
//Meteor.subscribe("searchmedocs");
Meteor.subscribe("searchresults");
// Meteor.subscribe("cart");
//if(Meteor.isClient){
	/*Session.setDefault('skip',o);
	Deps.autorun(function(){*/
		Meteor.subscribe("showarticle"/*,Session.get("skip")*/);
		//Meteor.subscribe("articlestore"/*,Session.get("skip")*/);

	/*});*/
//}
Meteor.subscribe('aideSoignants');
Meteor.subscribe('etablissements.all');
Tracker.autorun(function() {
Meteor.subscribe('userHistory');
});
