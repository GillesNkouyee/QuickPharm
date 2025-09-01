Meteor.methods({
  parseUpload_pharm( data ) {
    check( data, Array );

    for ( let i = 0; i < data.length; i++ ) {
      let item   = data[ i ],
          exists = Shop.findOne({_id:item.id});

      if (!exists) {
        Shop.insert(item);
      } else {
        console.warn( 'Rejected. This pharmacy already exists.' );
      }
    }
  }
});
