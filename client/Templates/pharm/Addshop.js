/** Controleur de creation d'une boutique **/

Template.Addshop.events({
	'submit #shopform': function(error,Shopid){
		event.preventDefault(event);
		var Owner = Meteor.user();
        var Shopid= this._id;

        if(!error){

				toastr.success("Nouvelle boutique crée par " + ' ' + Owner.profile.name);
				console.log('Shopid');
				Meteor.call('sendEmail','gillesnkouye@gmail.com','gilles.nkouyee@gmail.com','New shop created');
              }else {
              toastr.error(error);
		}

	}

});
AutoForm.addHooks(
  ["shopform"],
  {
    before   : {
      method: CfsAutoForm.Hooks.beforeInsert
    },
    after    : {
      method: CfsAutoForm.Hooks.afterInsert
    }
  }
);
Template.Addshop.onRendered(function(){
  $('.menu .item').tab();
  $('.ui.checkbox').checkbox();
});
// Template.Addshop.onRendered(function(){
// 			$('#myCollapsible').collapse({
// 		  toggle: false
// 		});
// 		$('#btn_new').click(function(){
// 		   $(this).find('span').toggleClass('glyphicon glyphicon-pencil').toggleClass('glyphicon glyphicon-plus');
// 		});
// });
