Template.navbar.onRendered(function(){
  $('.ui.dropdown').dropdown();
});
Template.navbar.events({
	'click #logout':function(){
		Meteor.logout();
		// Router.go('Home');
	}
});
////////////////////affichage des avatars et gestion des profiles utilisateurs////////////////////
Template.navbar.helpers({
  profilepic: function() {
		return Meteor.users.findOne(Meteor.userId()).profile.avatar_url
		},
    name: function() {
    return Meteor.users.findOne(Meteor.userId()).profile.name
  }
});
///////////////////////////////////////////////////////////////////////////////////////////////////
if (Meteor.isClient) {
  Template.docScanner.onRendered(function () {
    this.stream = null;
    this.videoEl = document.getElementById('scannerVideo');
    this.canvasEl = document.getElementById('snapshotCanvas');
    this.previewImg = document.getElementById('previewImage');
    this.uploadResult = document.getElementById('uploadResult');

    const startBtn = document.getElementById('startCamera');
    const stopBtn  = document.getElementById('stopCamera');
    const snapBtn  = document.getElementById('takeSnapshot');
    const uploadBtn = document.getElementById('uploadScan');

    startBtn.addEventListener('click', startCamera);
    stopBtn.addEventListener('click', stopCamera);
    snapBtn.addEventListener('click', takeSnapshot);
    uploadBtn.addEventListener('click', uploadSnapshot);
  });

  function startCamera() {
    const constraints = { video: { facingMode: "environment" }, audio: false };
    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        const video = document.getElementById('scannerVideo');
        video.srcObject = stream;
        video.play();
        // store stream to stop it later
        Template.instance().stream = stream;
      })
      .catch(err => {
        alert('Impossible d\'accéder à la caméra: ' + err.message);
      });
  }

  function stopCamera() {
    const inst = Template.instance();
    if (inst && inst.stream) {
      inst.stream.getTracks().forEach(t => t.stop());
      inst.stream = null;
      const video = document.getElementById('scannerVideo');
      video.srcObject = null;
    }
  }

  function takeSnapshot() {
    const video = document.getElementById('scannerVideo');
    const canvas = document.getElementById('snapshotCanvas');
    const ctx = canvas.getContext('2d');

    // Ajuste ici si tu veux crop/deskew, etc.
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataURL = canvas.toDataURL('image/jpeg', 0.9); // base64 image
    document.getElementById('previewImage').src = dataURL;
    // stocke le dataURL pour upload
    Session.set('lastScanDataURL', dataURL);
  }

  function uploadSnapshot() {
    const dataURL = Session.get('lastScanDataURL');
    if (!dataURL) {
      alert('Prends d\'abord une photo.');
      return;
    }

    // appel Meteor method pour stocker l'image côté serveur
    document.getElementById('uploadResult').innerText = 'Envoi en cours...';
    Meteor.call('scan.saveImage', dataURL, (err, res) => {
      if (err) {
        console.error(err);
        document.getElementById('uploadResult').innerText = 'Erreur : ' + err.reason || err.message;
        return;
      }
      // res contient l'URL publique du fichier
      document.getElementById('uploadResult').innerHTML = 'Enregistré : <a href="' + res.url + '" target="_blank">' + res.url + '</a>';
    });
  }
}
