import { Template } from 'meteor/templating';
import './aidesoignant_list.html';

Template.personnelsPage.helpers({
  personnels() {
    
    return AideSoignants.find().fetch();
  }
});
Template.personnelsPage.onRendered(function (){
 
});
