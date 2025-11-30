import { Template } from 'meteor/templating';
import './pharmacy_list.html';


Template.pharmaciesPage.helpers({
  pharmacies() {
    const params = new URLSearchParams(window.location.search);
    const ville = params.get('ville');
    const garde = params.get('garde') === 'true';
    let filters = {};
    if (ville) filters.ville = ville;
    if (params.has('garde')) filters.garde = garde;
    return Shop.find(filters).fetch();
  }
});


