
Meteor.methods({
  addComment: function(message,shopId) {
    //get current user
    var user = Meteor.user();
    //check if logged in
    if (!user){
      throw new Meteor.Error('You must be logged in order to submit a comment!');
    }
    //check message content is not empty
    if (!message){
      throw new Meteor.Error('invalid-comment', 'Vous devez saisir du texte ,comment can not be empty');
    }
    if (!shopId){
      throw new Meteor.Error('shop Id undefined');
    }
  //Shop.update(comments.shopId, {$inc: {commentsCount: 1}});
	Comments.insert({
   	  Message:message,
   	  UserId: user._id,
      Author: user.profile.name,
      submitted: new Date(),
      ShopId: shopId,
      AuthorPic: user.profile.avatar_url,

      //commentsCount: 0
    });
  },
  'deleteComment': function (commentId){
    //get current user
      var user = Meteor.user();
      if(commentId){
        Comments.remove(commentId);
        alert('comment deleted by'+user.profile.name );
        throw new Meteor.Alert('Confirm ur action');
      }


  }
});

/*

Meteor.methods({
    'addComment':function(message,shopId){

    	var user = Meteor.user();
    	//check if logged in
	    if (!user){
	      throw new Meteor.Error('You must be logged in to submit  comment!');
	    }
    	if (!message){
	      throw new Meteor.Error( 'Vous devez saisir du texte ,comment can not be empty');
	    }
		if (!shopId){
      	  throw new Meteor.Error('shop Id undefined');
    	}

		comment.UserId = user._id;
		comment.Message = message;
		comment.ShopId = shopId;
		comment.Author = user.profile.name;
		comment.submitted = new Date();

        Comments.insert(message,shopId,function(error,result){
      	if(error){
      		console.log("me voici ici"+ error);
      		}
      	});
    }

});
*/

/*
//commentsCount: 0
//Shop.update(comments.shopId, {$inc: {commentsCount: 1}});
    // userId & shopId are our foreign key
*/
