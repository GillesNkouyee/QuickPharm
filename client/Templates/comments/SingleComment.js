Template.SingleComment.helpers({
	commentDeleteRights: function(){
		if (Meteor.userId() == this.UserId){
			return true;
		}else{
			return false;
		}
	}
}); 
Template.SingleComment.events({
	'click #deleteComment': function (){
		Meteor.call('deleteComment',this._id, function(error) {
			if(!error){
				alert('Comment Deleted');
			}else{
				alert('You can not delete this comment!');
			}
		});
	}
});