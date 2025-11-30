Template.SinglePost.helpers({
	comments: function(){
        return Comments.find({ShopId:this._id},{sort: {submitted: -1}});
    }
    
});

Template.SingleComment.helpers({
	profilepic: function() {
		return Meteor.users.findOne(Meteor.userId()).profile.avatar_url
		}
	});