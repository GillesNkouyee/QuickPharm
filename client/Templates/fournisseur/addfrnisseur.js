Template.addFournisseur.onRendered(function(){
  $('.menu .item')
  .tab()
  ;
  $('.ui.checkbox')
    .checkbox()
  ;

      $('#btn_now').click(function(){
         $(this).find('span').toggleClass('glyphicon glyphicon-pencil').toggleClass('glyphicon glyphicon-plus');
      });
});

Template.addFournisseur.events({
  'submit #fsrform': function(err,id){
  event.preventDefault(event);
  var Owner = Meteor.user();
  if(err) {
         console.log(err);
          toastr.warning(err);
          //Router.go('gestionShop');
          } else {
            toastr.success("Nouveau fournisseur ajouté par " + ' ' + Owner.profile.name);
            console.log('id');
          }
      }
});
