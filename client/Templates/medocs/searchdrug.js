import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
// import { Medicaments } from '/imports/api/medicaments.js';

import './searchdrug.html'

const PAGE_SIZE = 5;

Template.searchMedicaments.onCreated(function () {
  this.searchResults = new ReactiveVar([]);
  this.currentPage = new ReactiveVar(1);
  this.totalResults = new ReactiveVar(0);
  this.lastSearchParams = new ReactiveVar({});
});

Template.searchMedicaments.helpers({
  searchResults() {
    return Template.instance().searchResults.get();
  },
  currentPage() {
    return Template.instance().currentPage.get();
  },
  disabledPrev() {
    return Template.instance().currentPage.get() === 1 ? 'disabled' : '';
  },
  disabledNext() {
    const instance = Template.instance();
    const page = instance.currentPage.get();
    const total = instance.totalResults.get();
    return (page * PAGE_SIZE >= total) ? 'disabled' : '';
  },
  categories() {
    // Extraction des catégories distinctes
    return _.uniq(Productdata.find({}, { fields: { category: 1 } })
      .fetch()
      .map(med => med.category)
      .filter(Boolean)).sort(); // ignore les valeurs nulles ou vides
  },
  badgeColor:function(){
       var cltacro = this.onpresc;
          if (cltacro == "oui") {
             return "label red";;
          } else {
        return " label "
      }
    },
});

Template.searchMedicaments.events({
  'submit #search-form'(event, instance) {
    event.preventDefault();
    instance.currentPage.set(1); // reset to page 1

    const nomQuery = event.target.searchQuery.value.trim();
    const selectedCategorie = event.target.categorieSelect.value;
    const priceOrder = event.target.priceOrder.value;

    const filter = {};
    if (nomQuery) {
      filter.brand = { $regex: nomQuery, $options: 'i' };
    }
    if (selectedCategorie) {
      filter.category = selectedCategorie;
    }

    instance.lastSearchParams.set({
      filter,
      priceOrder
    });

    performSearch(instance);
  },

  'click #reset-form'(event, instance) {
    document.getElementById('search-form').reset();
    instance.searchResults.set([]);
    instance.totalResults.set(0);
    instance.currentPage.set(1);
  },

  'click #prev-page'(event, instance) {
    const current = instance.currentPage.get();
    if (current > 1) {
      instance.currentPage.set(current - 1);
      performSearch(instance);
    }
  },

  'click #next-page'(event, instance) {
    const current = instance.currentPage.get();
    instance.currentPage.set(current + 1);
    performSearch(instance);
  },
  'click .btn-call-comparison'(event, instance) {
     Meteor.call('userHistory.increment', Meteor.userId(), 'comparedPrices');
     //alert('Interaction en vue');
  },
  'click .btn-call-searchDrug'(event, instance) {
     Meteor.call('userHistory.increment', Meteor.userId(), 'searchedDrug');
     //alert('Interaction en vue');
  }

});

function performSearch(instance) {
  const { filter, priceOrder } = instance.lastSearchParams.get();
  const page = instance.currentPage.get();

  const skip = (page - 1) * PAGE_SIZE;
  const limit = PAGE_SIZE;

  let cursor = Productdata.find(filter, {
    sort: priceOrder === 'asc' ? { price: 1 } :
          priceOrder === 'desc' ? { price: -1 } : {},
    skip,
    limit
  });

  const total = Productdata.find(filter).count();

  instance.totalResults.set(total);
  instance.searchResults.set(cursor.fetch());
}

Template.searchMedicaments.onRendered(function(){
  
});
  