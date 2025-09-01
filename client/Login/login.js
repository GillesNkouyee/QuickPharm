Template.login.events({
  'submit #loginForm': function(event) {
        event.preventDefault();
        var emailVar = event.target.loginemail.value;
        var passwordVar = event.target.loginpassword.value;
        console.log("Form submitted.");

        setTimeout(function() {
        Meteor.loginWithPassword(emailVar, passwordVar, function(err,result){
         if(!err){  //use this if there is not error redirect them.
           toastr.success('Access granted')
           Router.go('Home')
          }else{
           console.log(err.reason) //should print the error
           Bert.alert(err.reason,'danger');
          }
        });

    }, 500);
  }
});
