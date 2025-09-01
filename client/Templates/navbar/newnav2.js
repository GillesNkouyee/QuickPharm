Template.newnav.onRendered(function(){
  $(".openbtn").on("click", function() {
    $(".ui.sidebar").toggleClass("very thin icon");
    $(".asd").toggleClass("marginlefting");
    $(".sidebar z").toggleClass("displaynone");
    $(".ui.accordion").toggleClass("displaynone");
    $(".ui.dropdown.item").toggleClass("displayblock");
 
    $(".logo").find('img').toggle();
 
  })
  
  $(".ui.dropdown").dropdown({
    allowCategorySelection: true,
    transition: "fade up",
    context: 'sidebar',
    on: "hover"
  });
 
  $('.ui.accordion').accordion({
    selector: {
 
    }
  });
    $(document).on('hidden.bs.modal', function () {
    $('.modal-backdrop').remove();
    $('body').removeClass('modal-open'); // Pour éviter le scroll bloqué
  })
});
Template.newnav.helpers({
  profilepic: function() {
		return Meteor.users.findOne(Meteor.userId()).profile.avatar_url
		},
    name: function() {
    return Meteor.users.findOne(Meteor.userId()).profile.name
  }
});
Template.newnav.events({
	'click #logout':function(){
		Meteor.logout();
		Router.go('/');
	},
  "click #scanAndSend"(e) {
      captureAndSend();
    }
});
if (Meteor.isCordova) {
  // Fonction pour scanner avec la caméra
  function scanDocument() {
    return new Promise((resolve, reject) => {
      cordova.plugins.DocumentScanner.scanDoc(
        (res) => resolve(res), // chemin image (ex: file:///...)
        (err) => reject(err)
      );
    });
  }

  async function captureAndSend() {
    try {
      // Étape 1 : scan du document avec la caméra
      const imagePath = await scanDocument();

      // Étape 2 : conversion en PDF via méthode serveur
      Meteor.call("convertToPDF", imagePath, (err, pdfPath) => {
        if (err) {
          alert("Erreur conversion PDF : " + err);
        } else {
          // Étape 3 : partage sur WhatsApp
          window.plugins.socialsharing.shareViaWhatsApp(
            "Voici le document scanné 📄",
            null,        // pas d'image supplémentaire
            pdfPath,     // chemin du fichier PDF
            () => alert("Envoyé avec succès ✅"),
            (errMsg) => alert("Erreur partage : " + errMsg)
          );
        }
      });
    } catch (e) {
      alert("Erreur scan : " + e);
    }
  }

  // Exposer au template / bouton
  
}