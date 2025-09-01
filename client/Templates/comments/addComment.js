
Template.addComment.events({
  'submit #addCommentForm':function(event,template){
  event.preventDefault();
    var user = Meteor.user();
    var message = event.target.addComment.value;
    //get shopId
    var shopId = template.data._id;
    console.log(message,shopId);
    Meteor.call('addComment', message, shopId, function(error){
        if(error){
            toastr.info(error);
        }else{
          toastr.info('new comment by :' +'  '+user.profile.name,{progressBar:1});
        }
    });
   }
});