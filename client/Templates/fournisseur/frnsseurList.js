this.fsrliste = new ReactiveVar([]);
Template.frnisseurList.onCreated(function() {
  fsrliste.set(Fournisseurs.find({}, {sort: {createdAt: -1},limit:8}));
  Blaze._allowJavascriptUrls();


});

Template.frnisseurList.events({
  'change #Fsseur':function(e,tpl){
    e.preventDefault();

    var unFsr = $('#Fsseur option:selected').text();
     var uneligne = Fournisseurs.findOne({'name':unFsr});
     Session.set('FsrName',uneligne.name);
     Session.set('FsrMobile',uneligne.mobile);
     Session.set('FsrMails',uneligne.emails);
     var FsrName = Session.get('FsrName');
     var FsrMobile = Session.get('FsrMobile');
     var FsrMails = Session.get('FsrMails');
    console.log(FsrName , FsrMobile, FsrMails);
  },
  'submit #newproforma':function(e,templ){
    e.preventDefault();

    var to = 'wafyg20@gmail.com';
    var cc = 'gillesnkouye@gmail.com';
    var from = 'ostracking@infocam.com';
    var subject = 'Demande de Bon Commande!';
    var replyTo = 'gillesnkouye@gmail.com';
    var emailData = {
       text : $('#message').val(),
       phone : $('#FsrMobile').val(),
       name :$('#FsrName').val(),
       email:$('#FsrMails').val()
        };

    Meteor.call('sendEmail',to,cc,from,subject,replyTo,emailData);
    Session.set('done', true);
    document.getElementById('FsrMobile').value = '';
    document.getElementById('message').value = '';
    document.getElementById('FsrMails').value = '';
    document.getElementById('FsrName').value = '';

    console.log(emailData);
  }

});

Template.frnisseurList.helpers({
  fsseurlist: function(){
      return fsrliste.get();
    },
    hasitem: function(){
        //var currentUser = Meteor.userId();
      return  fsrliste.get().count();
    },
    lefrnisseur: function(){
        return Session.get('FsrName');
    },
    mobilefrnisseur: function(){
        return Session.get('FsrMobile');
    },
    mailfrnisseur: function(){
        return Session.get('FsrMails');
    },
    afficherfsr:function(){
    var listedefsr = Fournisseurs.find({});
    if(listedefsr){
      return listedefsr;
      }
    },
    done:function(){
            return Session.equals('done',false);
     }

});
// Template.email.events({
//
// });
// Template.email.helpers({
  // done:function(){
  //         return Session.equals('done',false);
  //  }
// });
// Template.frnisseurList.onRendered(function(){
//   $('table td').dblclick(function(){
// 		var cell = $(this).attr('id');
// 		var row = $(this).attr('id');
// 		alert('Cellule: '+cell+' Ligne: '+row);
//
// 	});
// });
