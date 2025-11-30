import { Template } from 'meteor/templating';
import './etablissement_list.html';


Template.formationsPage.helpers({
  etablissements() {
    
    return Etablissements.find().fetch();
  }
});

