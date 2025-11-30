Template.uploadPharm.onCreated( () => {
  Template.instance().uploading = new ReactiveVar( false );
});

Template.uploadPharm.helpers({
  uploading() {
    return Template.instance().uploading.get();
  }
});
Template.uploadPharm.events({
  'change [name="uploadCSV"]' ( event, template ) {
    template.uploading.set( true );

    Papa.parse( event.target.files[0], {
      header: true,
      complete( results, file ) {
        Meteor.call( 'parseUpload_pharm', results.data, ( error, response ) => {
          if ( error ) {
            console.log( error.reason );
          } else {
            template.uploading.set( false );
            Bert.alert( 'Upload complete!', 'success', 'growl-top-right' );
          }
        });
      }
    });
  }
});
Template.uploadPharm.onRendered(function(){
  $('.message .close')
  .on('click', function() {
    $(this)
      .closest('.message')
      .transition('fade')
    ;
  });
});
