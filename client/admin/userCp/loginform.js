Template.register.events({
    'submit #regform': function(event) {
        event.preventDefault();
        var username = event.target.regUsername.value;
        var emailVar = event.target.regEmail.value;
        var passwordVar = event.target.regPassword.value;
        Accounts.createUser({
            email: emailVar,
            password: passwordVar,
            profile:{name:username,avatar_url:'/ad4.jpg',lastname:'',gender:'',organization:'',occupation:'',birthday:'',mobile:'',website:'',
            status:'',bio:'',}

        }
      );
         Router.go('Home');
        return false;
    }

});
//For the “login” template, the code is almost identical:

// Template.register.events({
// 'submit #regform': function(event) {
//     event.preventDefault();
//     var username = event.target.regUsername.value;
//     var emailVar = event.target.regEmail.value;
//     var passwordVar = event.target.regPassword.value;
//     Accounts.createUser({
//         email: emailVar,
//         password: passwordVar,
//         profile:{name:username,avatar_url:'/ad4.jpg',lastname:'',gender:'',organization:'',occupation:'',birthday:'',mobile:'',website:'',
//         status:'',bio:'',}
//
//     });
//   }
// });
// Template.LoginForm.onRendered(function(){
//     $(".dropdown-button").dropdown();
// });
