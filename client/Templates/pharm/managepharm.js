Template.managepharm.helpers({
  'showAllpharm': function(){
    var Allpharm = Shop.find({});
    if(Allpharm){
      return Allpharm;
    }else{
      return ("No Results here");
    }
  }


});
