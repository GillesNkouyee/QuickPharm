//creation de l'administrateur systeme
Meteor.startup(function() {
	if(Meteor.users.find().count() < 1) {
		var id = Accounts.createUser({
			email:'gilles.nkouyee@gmail.com',
			password:'adminadmin2014',
			profile:{name:'Gilles.Arsene',
                avatar_url:'/ad4.jpg',lastname:'Nkouye\'e',mobile:'699103611/681238611',occupation:'Developer',status:'Work hard ; Play hard !',birthday:'10/04/1984',
							organization:'',website:'',bio:'',gender:''}
		});

		Roles.addUsersToRoles(id,'admin');
	}
});

//Attribue le role 'default' a un utilisateur qui se logue sans avoir deja un role defini par l'admin
Accounts.onLogin(function(user) {
        var user = user.user;
        var defaultRole = ['basic'];
        if (!user.roles){
            Roles.addUsersToRoles(user, defaultRole)
        };
    });
Accounts.validateLoginAttempt(function(attempt) {
				  if(Roles.userIsInRole(attempt.user._id, ['inactive'])) {
				    attempt.allowed = false;
				    throw new Meteor.Error(403, "User account is inactive!");
				  }
				  return true;
		});
