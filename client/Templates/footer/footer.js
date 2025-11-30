Template.footer.onRendered(function () {
    // Init carte Google Maps
    const map = new google.maps.Map(document.getElementById("map-footer"), {
      center: { lat: 4.0701, lng: 9.7129 }, // Coordonnées approximatives de Bonamoussadi
      zoom: 14,
    });
  
    new google.maps.Marker({
      position: { lat: 4.0701, lng: 9.7129 },
      map,
      title: "EGF-IT Consulting",
    });
  });
  
  Template.footer.helpers({
    currentYear() {
      return new Date().getFullYear();
    }
  });
  