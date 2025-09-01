// if (Meteor.isClient) {
const itemsPerPage = 6;
const currentPage = new ReactiveVar(1);

Template.searchmedocs.onCreated(function() {
  var self=this;
  
  this.autorun(() => {
    const page = currentPage.get();
    this.subscribe('paginatedDrugs', page, itemsPerPage);
  });
  
  Blaze._allowJavascriptUrls();

});
Template.searchmedocs.events ({
  "submit #search": function (e) {
      e.preventDefault();
      Session.set('searchValue', $("#searchValue").val());

    },
    'click .next-page'(event, template) {
      currentPage.set(currentPage.get() + 1);
    },
    'click .prev-page'(event, template) {
      if (currentPage.get() > 1) {
        currentPage.set(currentPage.get() - 1);
      }
    }

 });

    Template.searchmedocs.helpers({
        medicaments: function() {
          Meteor.subscribe("searchmedocs", Session.get('searchValue'));
          if (Session.get('searchValue')) {
            return Productdata.find({}, { skip: (currentPage.get() - 1) * itemsPerPage, limit: itemsPerPage });
          } else {
            Session.get('searchValue', "");
            return throwError(403, 'No result found');
          }
        },
        page() {
          return currentPage.get();
        },
        distinctBrand: function() {
          return _.uniq(Productdata.find({},{sort: {
            brand: 1},fields:{brand:true}
          }).fetch(), true, doc => {
            return doc.brand;
          });
        }
      });
 //}
Template.searchmedocs.onRendered(function(){
  // onClick searchBtn effects

      $('#input-search').on('keyup', function() {
        var rex = new RegExp($(this).val(), 'i');
          $('.searchable-container .items').hide();
          $('.searchable-container .items').filter(function() {
              return rex.test($(this).text());
          }).show();
        });
        $(function(){
          $('#searchBtn').click(function() {
            document.getElementById( 'leresultat' ).scrollIntoView();
                window.setTimeout( function () { fade ('slow'); },3000 );
        });


    });
    $(function () {
    $("div").slice(0, 4).show();
    $("#loadMore").on('click', function (e) {
        e.preventDefault();
        $("div:hidden").slice(0, 4).slideDown();
        if ($("div:hidden").length == 0) {
            $("#load").fadeOut('slow');
        }
        $('html,body').animate({
            scrollTop: $(this).offset().top
        }, 1500);
      });
    });

    $('a[href=#top]').click(function () {
        $('body,html').animate({
            scrollTop: 0
        }, 600);
        return false;
    });

    $(window).scroll(function () {
        if ($(this).scrollTop() > 50) {
            $('.totop a').fadeIn();
        } else {
            $('.totop a').fadeOut();
        }
    });
         
});
