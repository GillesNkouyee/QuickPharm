/* 
var SearchData = new ReactiveVar(null);
var map;
var popup;
var Markers = [];
var circles = [];
var infowindow = null;

if (Meteor.isClient) {
  Meteor.startup(function () {
    GoogleMaps.load({ v: '3', key: 'AIzaSyCLCIF1GiULrtKjrsu8RPU--JZRyKRwg0c', libraries: 'places' });
  });
} 

var createMap = function () {
  popup = new google.maps.InfoWindow();
  var center = new google.maps.LatLng(4.864716, 9.349014);
  var options = {
    zoom: 10,
    center: center,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    streetViewControl: true,
    scaleControl: true,
    draggable: true,
    disableDefaultUI: false,
    zoomControl: true,
    zoomControlOptions: {
      style: google.maps.ZoomControlStyle.SMALL
    },
    overviewMapControl: true,
    overviewMapControlOptions: {
      opened: true
    }
  };

  // map = new google.maps.Map(document.getElementById("searchMapContainer"), options);
};



Template.map.onRendered(function () {

  var addMarkersToMap = function (map) {
  
    if (!map) {
      console.log("Map non initialisée!");
      return;
    }
  
    Markers.forEach(marker => marker.setMap(null));
    Markers = [];
    const shops = shops.find().fetch(); // ✅ maintenant c'est un tableau
    shops.forEach((shop, i) => {
      var lat = shop.location.lat;
      var lng = shop.location.lng;
      var pharmtitle = shop.shopname;
      var pharmaddress = shop.shopadress;
      var pictof = shop.shoplogo;
      var url = Articles.findOne(pictof)?.original?.name || '';
      var slogan = shop.shopslogan;
      var guardstatus = shop.garde;
  
      if (i === 0) {
        map.setCenter(new google.maps.LatLng(lat, lng));
      }
  
      var marker = new google.maps.Marker({
        position: { lat: lat, lng: lng },
        map: map,
        title: pharmtitle,
        icon: 'mapicons/medicine.png'
      });
  
      var contentString = `
        <div style="margin:0 0 0 5px;">
          <b>${pharmtitle}</b>
          <img src="${url}" class="img-responsive"/>
          <h5 style="text-align:center;">${slogan}</h5><br>
          <b>Location:</b> ${pharmaddress}
        </div>`;
  
      marker.addListener("click", function () {
        if (!infowindow) infowindow = new google.maps.InfoWindow();
        infowindow.setContent(contentString);
        infowindow.open(map, marker);
  
        if (guardstatus === 'oui') {
          toastr.error('Cette pharmacie est de garde!', {
            "closeButton": true,
            "positionClass": "toast-bottom-right"
          });
        }
  
        console.log("clicked on ", shop);
      });
  
      Markers.push(marker);
    });
  
    // Ajout du filtre de ville
    $('#ville').off('change').on('change', function () {
      var selectedVille = $('#ville option:selected').text();
      const shops = Shop.find().fetch();
      shops.forEach((shop, i) => {
        if (selectedVille === 'ALL' || selectedVille === shop.shopadress) {
          Markers[i].setVisible(true);
        } else {
          Markers[i].setVisible(false);
        }
      });
    });
  };
  
  Tracker.afterFlush(() => {
    const mapElement = document.getElementById('searchMapContainer');

    if (mapElement) {
      const map = new google.maps.Map(mapElement, {
        center: { lat: 4.061536, lng: 9.786072 }, // Douala
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        streetViewControl: true,
        scaleControl: true,
        draggable: true
      });

      // Attendre que Google Maps ait fini de charger
      google.maps.event.addListenerOnce(map, 'idle', () => {
        addMarkersToMap(map);
      });
    } else {
      console.error("🛑 Élément DOM 'map' introuvable !");
    }
  });

 
  this.autorun(() => {
    var shops = Shop.find({}).fetch();
    if (shops.length > 0) {
      addMarkersToMap(shops);
    }
  }); 
});

Template.map.helpers({
  geolocationError() {
    var error = Geolocation.error();
    return error && error.message;
  },
  uniqueCities() {
    if (typeof shop !== 'undefined') {
      const cities = Shop.find({}, { fields: { shopadress: 1 } }).fetch();
      return _.uniq(cities.map(p => p.shopadress));
    } else {
      console.error("Collection Pharmacies non définie");
      return [];
    }
  }
  
});

AutoForm.addHooks("searchShop", {
  onSubmit(insertDoc) {
    check(insertDoc, Schemas.Search);
    SearchData.set(insertDoc);
    this.done();
    return false;
  },
  onError(formType, error) {
    console.log("error", formType, error);
  }
});

$(function () {
  toastr.options = {
    "closeButton": true,
    "positionClass": "toast-bottom-right",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "preventDuplicates": true
  };
});

 */