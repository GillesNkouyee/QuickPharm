var createIndex = function () {
  var idx = lunr(function () {
    this.field('specialite');
    this.field('localisation');
    this.field('nom');
    this.field('prenom');
    this.field('disponible');
    this.ref('_id');

  });
  return idx;
};
const itemsPerPage = 12;
const currentPage = new ReactiveVar(1);

Template.searchAidesoignant.onCreated(function() {
  var self=this;
  
  this.autorun(() => {
    const page = currentPage.get();
    this.subscribe('paginatedAssistant', page, itemsPerPage);
  });
  
  Blaze._allowJavascriptUrls();

});
Template.searchAidesoignant.onRendered ( function () {
//initiate the search session
  
    Session.setDefault('search', null);
    

    // Événement : clic sur bouton "Détails"
    $(document).on('click', '.show-details', function () {
      const $el = $(this);

      // Récupération des données
      $('#modalNom').text($el.data('nom'));
      $('#modalPrenom').text($el.data('prenom'));
      $('#modalSpecialite').text($el.data('specialite'));
      $('#modalDisponible').text($el.data('disponible'));
      $('#modalTelephone').text($el.data('telephone'));

     
  });
});
Template.searchAidesoignant.helpers({
//create a helper to get what the current search value is
search: function () {
  var search = Session.get('search');
  return search;
},
page() {
  return currentPage.get();
},
//create a helper that returns the search results
searchResults: function () {
  var index, docs, searchResults;
  var search = Session.get('search');
  var results = [];
  if (search) {
    //create the index (see function above)
    index = createIndex();
    docs = AideSoignants.find({}, { skip: (currentPage.get() - 1) * itemsPerPage, limit: itemsPerPage }).fetch();
    //for each Agent available to the client...
    _.each(docs, function (todo) {
      //add the todo to the index
      index.add(todo);
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
      }
    });
  }
  return results;
}
});

Template.searchAidesoignant.events({
  //update the search session when the search input changes
  'keyup #search, change #search' : function (event) {
    var search;
    search = event.target.value;
    Session.set('search', search);
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
