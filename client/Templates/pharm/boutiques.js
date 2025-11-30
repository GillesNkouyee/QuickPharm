var createIndex = function () {
    var idx = lunr(function () {
      this.field('shopcategory');
      this.field('shopadress');
      this.field('garde');
      this.ref('_id');

    });
    return idx;
  };
  Template.boutiques.rendered = function () {
  //initiate the search session
  //Session.set('resultnber',0);
  Session.setDefault('search', null);

  };
  Template.boutiques.onRendered(function () {
  //initiate the search session
  Session.set('boutiquelimit',8);
  //Session.set('resultnber',0);
  lastScrollTop=0;
  $(window).scroll(function(event){
    //detect near bottom of the window
    if($(window).scrollTop()+$(window).height() > $(document).height()-100){
      //check where we already
      var scrollTop = $(this).scrollTop();
      if (scrollTop > lastScrollTop) {

        Session.set('boutiquelimit',Session.get('boutiquelimit')+4);
        Bert.alert("Going down at bottom of window");
      } else {

        console.log("up");
      }
    lastScrollTop = scrollTop;

    Bert.alert('hey gilles, did u fix the issue ? it\'s all good already!','info');
    //console.log(new Date(),issuelimit);
    }
  })

  });
Template.boutiques.helpers({
  //create a helper to get what the current search value is
  search: function () {
    var search = Session.get('search');
    return search;
  },

  //create a helper that returns the search results
  searchResults: function () {
    var index, docs, searchResults;
    var resultnber;
    var search = Session.get('search');
    var results = [];
    if (search) {
      //create the index (see function above)
      index = createIndex();
      docs = Shop.find({},{sort:{createdAt:-1},limit:(Session.get('boutiquelimit'))}).fetch();
      //for each Agent available to the client...
      _.each(docs, function (boutique) {
        //add the todo to the index
        index.add(boutique);
      });
      //process the search results
      //[{ref: 'mongoId', score: 0.923},...]
      searchResults = index.search(search);

      //for each of the search results score...
      _.each(searchResults, function (searchResult) {
        //only add if the results are above zero, zero means no result
        if (searchResult.score > 0) {
          //add doc to the list of valid results
          results.push(_.findWhere(docs, {_id: searchResult.ref}));
          // Session.get('resultnber',results.length);
          // Session.set('resultnber',Session.get('resultnber',results.length));
          //console.log(resultnber);
        }
      });
    }
    return results;

  }
  ,
  rangetime: function(){
   var start = this.startTime;
   var end   = this.endTime;
   var diff  = new Date(end - start);
   var days  = diff/1000/60/60;

   if (days > 0) {
     return days;
     } else {
       return 'Incident en cours ';
     }
   }
  });

  Template.boutiques.events({
    //update the search session when the search input changes
    'keyup #search, change #search' : function (event) {
      var search;
      search = event.target.value;
      Session.set('search', search);
    }
  });
