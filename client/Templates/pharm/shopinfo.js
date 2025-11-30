Template.shopinfo.onRendered(function(){
  $('.menu .item').tab();
  $('.ui.checkbox').checkbox();

  $('.post-module').hover(function() {
    $(this).find('.description').stop().animate({
      height: "toggle",
      opacity: "toggle"
    }, 300);
  });
});
Template.shopinfo.helpers({

  	shopinfo: function(){
		return  Shop.findOne(Router.current().params._id);
        //var shoplike = Meteor.Shop.findOne();
	},
	files: function() {
    return Images.findOne({shop: this._id});
  },

  userinfo: function() {
    var talkinguser = Meteor.userId();
    return Meteor.users.findOne(talkinguser);
  }

});




/*showarticle management*/
Template.showarticle.helpers({

    shoparticle: function(){

        return Articles.find({fileShopId:this._id},{sort: {uploadedAt:-1}});
    },
    newshoparticle: function(){
    var start = this.uploadedAt;
    var end   = new Date();
    var diff  = new Date(end - start);
    var days  = diff/1000/60/60/24;

    if (days > 1) {
      return 'label label-danger New hidden';
      } else {
        return 'label label-important arrowed-right New ';
      }
    },
    articleDeleteRights: function(){
        var user = Meteor.user();
        if (user._id == this.addedBy){
            return true;
        }else{
            return false;
        }
    }
});

Template.showarticle.events({

   'click .articledel':function(event,template){
    event.preventDefault();
        Articles.remove(this._id);
        toastr.error(" Some article removed !");
    },
    'click .previous':function(event,template){
    event.preventDefault();
        if(Session.get('skip')>10){
            Session.set('skip',Session.get('skip')-10);
            }
        },
    'click .next':function(event,template){
    event.preventDefault();
        Session.set('skip',Session.get('skip')+10);
    }
    });
Template.email.events({
  'submit #sentMessage':function(event,template){
    event.preventDefault();
    var to = this.shopmail;
    var cc = 'gillesnkouye@gmail.com';
    var from = $('#email').val();
    var subject = 'QuickPharm newsletter subscription !';
    var replyTo = this.shopmail;
    var emailData = {
       text : $('#message').val(),
       phone : $('#phone').val(),
       name :$('#name').val(),
       email:$('#email').val(),
        };

    Meteor.call('sendEmail',to,cc,from,subject,replyTo,emailData);

    event.target.phone.value = '';
    document.getElementById('message').value = '';
    document.getElementById('email').value = '';
    document.getElementById('name').value = '';
    Session.set('done', true);
    //console.log(text);
  }

});
Template.email.helpers({
  done:function(){
          return Session.equals('done',false);
   }
});
