Meteor.methods({
  parseUpload( data ) {
    check( data, Array );

    for ( let i = 0; i < data.length; i++ ) {
      let item   = data[ i ],
          exists = Productdata.findOne({_id:item.id});

      if (!exists) {
        Productdata.insert(item);
      } else {
        console.warn( 'Rejected. This item already exists.' );
      }
    }
  }
});
