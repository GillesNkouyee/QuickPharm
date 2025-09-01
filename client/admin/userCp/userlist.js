Template.userlist.onCreated( () => {
  Template.instance().subscribe( 'users' );
});

Template.userlist.helpers({
  userlistitem: function() {
    return Meteor.users.find().fetch();
  },
  usercount:function(){
       var usercount = Meteor.users.find().count();
        if(usercount){
       return usercount;
     }
   }
});
