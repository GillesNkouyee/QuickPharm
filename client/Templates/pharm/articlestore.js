Template.articlestore.helpers({
  // templatePagination: function () {
  //       return Template.instance().pagination;
  //   },
  //   clickEvent: function() {
  //       return function(e, templateInstance, clickedPage) {
  //           e.preventDefault();
  //           console.log('Changing page from ', templateInstance.data.pagination.currentPage(), ' to ', clickedPage);
  //       };
  //   },

  articlestore:function(){
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
    distinctmedocType: function() {
      return _.uniq(Productdata.find({fileShopId:this._id},{sort: {
        tag: 1},fields:{tag:true}
      }).fetch(), true, doc => {
        return doc.tag;
      });
    },
    updateZone: function(){
      var user = Meteor.user();
    if (user._id != this.createdBy) {
      return 'btn btn-large btn-info hidden';
      } else {
        return 'btn btn-large btn-info ';
      }
    }
});
Template.articlestore.onRendered(function(){

  $('#filterOptions li a').click(function() {
       // fetch the class of the clicked item
       var ourClass = $(this).attr('class');

       // reset the active class on all the buttons
       $('#filterOptions li').removeClass ('active');
       // update the active state on our clicked button
       $(this).parent().addClass('active');

       if(ourClass == 'all') {
           // show all our items
           $('#medocitem').children('div.productbox').show();
       }
       else {
           // hide all elements that don't share ourClass
          $('div').each(function(){
           $('#medocitem').children('div:not(.' + ourClass + ')').hide();
           // show all elements that do share ourClass
           $('#medocitem').children('div.' + ourClass).show();
          });
        }
       return false;
       });
/*load more controls*/


   });
