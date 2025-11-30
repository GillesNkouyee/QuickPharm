Template.userProfile.onCreated(function(){
	this.editMode = new ReactiveVar(false);
	//or this.editMode = new ReactiveVar();this.editMode.set(false);
})
Template.userProfile.events({
	'change .myFileInput': function(event, template) {
      FS.Utility.eachFile(event, function(file) {
        Images.insert(file, function (err, fileObj) {
          if (err){
             // handle error
             console.log( err);
          } else {
             // handle success depending what you need to do
              alert('Upload succeeded!'), setTimeout(function() {

            var userId = Meteor.userId();
            var imageURL = {
              "profile.avatar_url" : "/cfs/files/images/" + fileObj._id
            };
            Meteor.users.update(userId, {$set: imageURL});
                  }, 2000);
                }
            });
	   });
	 },
	 "click .pencil.alternate":function(){
     Session.set('editMode',!Session.get('editMode'));
   }
});
Template.userProfile.helpers({
  getdate: function(){
      var mydate =Date.now();
      return mydate.toDateString();
  },
  imageURL: function() {
    return Meteor.users.findOne(Meteor.userId()).profile.avatar_url
  },
  name: function() {
    return Meteor.users.findOne(Meteor.userId()).profile.name
  },
    lastname: function() {
    return Meteor.users.findOne(Meteor.userId()).profile.lastname
  },
    mobile: function() {
    return Meteor.users.findOne(Meteor.userId()).profile.mobile
  },
    status: function() {
    return Meteor.users.findOne(Meteor.userId()).profile.status
  },
    occupation: function() {
    return Meteor.users.findOne(Meteor.userId()).profile.occupation
  },
    birthday: function() {
    return Meteor.users.findOne(Meteor.userId()).profile.birthday
  },
  mail: function() {
    return Meteor.users.findOne(Meteor.userId()).emails[0].address
  },
  role: function() {
    return Meteor.users.findOne(Meteor.userId()).roles },
  userProfile : function() {
    return Meteor.users.findOne({_id: Meteor.userId});
  }
});

Template.userProfile.onRendered(function(){
  $(document).on('click', '#close-preview', function(){
    $('.image-preview').popover('hide');
    // Hover befor close the preview
    $('.image-preview').hover(
        function () {
           $('.image-preview').popover('show');
        },
         function () {
           $('.image-preview').popover('hide');
        }
    );
});

$(function() {
    // Create the close button
    var closebtn = $('<button/>', {
        type:"button",
        text: 'x',
        id: 'close-preview',
        style: 'font-size: initial;',
    });
    closebtn.attr("class","close pull-right");
    // Set the popover default content
    $('.image-preview').popover({
        trigger:'manual',
        html:true,
        title: "<strong>Preview</strong>"+$(closebtn)[0].outerHTML,
        content: "There's no image",
        placement:'bottom'
    });
    // Clear event
    $('.image-preview-clear').click(function(){
        $('.image-preview').attr("data-content","").popover('hide');
        $('.image-preview-filename').val("");
        $('.image-preview-clear').hide();
        $('.image-preview-input input:file').val("");
        $(".image-preview-input-title").text("Browse");
    });
    // Create the preview image
    $(".image-preview-input input:file").change(function (){
        var img = $('<img/>', {
            id: 'dynamic',
            width:250,
            height:200
        });
        var file = this.files[0];
        var reader = new FileReader();
        // Set preview image into the popover data-content
        reader.onload = function (e) {
            $(".image-preview-input-title").text("Change");
            $(".image-preview-clear").show();
            $(".image-preview-filename").val(file.name);
            img.attr('src', e.target.result);
            $(".image-preview").attr("data-content",$(img)[0].outerHTML).popover("show");
        }
        reader.readAsDataURL(file);
    });
});

});
