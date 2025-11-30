
    
Template.navigator.onRendered(function(){
    $(document).ready(function () {
        $('.navbar-light .dmenu').hover(function () {
            $(this).find('.sm-menu').first().stop(true, true).slideDown(150);
        }, function () {
            $(this).find('.sm-menu').first().stop(true, true).slideUp(105)
        });
    });
    $(document).ready(function () { 
        $(".megamenu").on("click", function(e) {
            e.stopPropagation();
        });
    });
        $(".openbtn").on("click", function() {
          $(".ui.sidebar").toggleClass("very thin icon");
          $(".asd").toggleClass("marginlefting");
          $(".sidebar z").toggleClass("displaynone");
          $(".ui.accordion").toggleClass("displaynone");
          $(".ui.dropdown.item").toggleClass("displayblock");
       
          $(".logo").find('img').toggle();
       
        })
        $(".ui.dropdown").dropdown({
          allowCategorySelection: true,
          transition: "fade up",
          context: 'sidebar',
          on: "hover"
        });
       
        $('.ui.accordion').accordion({
          selector: {
       
          }
        });
      });
      Template.navigator.helpers({
        profilepic: function() {
              return Meteor.users.findOne(Meteor.userId()).profile.avatar_url
              },
          name: function() {
          return Meteor.users.findOne(Meteor.userId()).profile.name
        }
      });
      Template.navigator.events({
          'click #logout':function(){
              Meteor.logout();
              Router.go('index');
          }
      });
      