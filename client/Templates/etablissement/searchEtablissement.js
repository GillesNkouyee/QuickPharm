import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
// import { Medicaments } from '/imports/api/medicaments.js';

import './searchEtablissement.html'

const PAGE_SIZE = 6;

Template.searchEtablissements.onCreated(function () {
  this.searchResults = new ReactiveVar([]);
  this.currentPage = new ReactiveVar(1);
  this.totalResults = new ReactiveVar(0);
  this.lastSearchParams = new ReactiveVar({});
});

Template.searchEtablissements.onRendered(function () {
  const instance = this;

  if (typeof google === "undefined") {
    $.getScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyCLCIF1GiULrtKjrsu8RPU--JZRyKRwg0c&libraries=places")
      .done(function () {
        if (typeof google !== "undefined" && typeof google.maps !== "undefined") {
          initMapFunctions();
        } else {
          navigator.geolocation.getCurrentPosition((position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;
            const etabLat = parseFloat(document.getElementById("helpLat").innerText);
            const etabLng = parseFloat(document.getElementById("helpLong").innerText);
            loadLeafletFallback(userLat, userLng, etabLat, etabLng);
          });
        }
      })
      .fail(function () {
        alert("Erreur de chargement de l’API Google Maps.");
      });
  } else {
    initMapFunctions();
  }
});

// Fallback Leaflet
function loadLeafletFallback(userLat, userLng, etabLat, etabLng) {
  const leafletCSS = document.createElement("link");
  leafletCSS.rel = "stylesheet";
  leafletCSS.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
  document.head.appendChild(leafletCSS);

  const leafletJS = document.createElement("script");
  leafletJS.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
  leafletJS.onload = function () {
    const map = L.map('map').setView([userLat, userLng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    L.marker([userLat, userLng]).addTo(map).bindPopup("Votre position").openPopup();
    L.marker([etabLat, etabLng]).addTo(map).bindPopup("Formation sanitaire");

    const route = L.polyline([[userLat, userLng], [etabLat, etabLng]], {
      color: 'orange'
    }).addTo(map);

    map.fitBounds(route.getBounds());

    document.getElementById("distance").innerText = "Calcul manuel approximatif";
    document.getElementById("duration").innerText = "Durée estimée : inconnue";
  };
  document.body.appendChild(leafletJS);
}

function initMapFunctions() {
  let map;
  let travelMode = google.maps.TravelMode.DRIVING;

  $(document).on('click', '#toggle-mode', function () {
    travelMode = (travelMode === google.maps.TravelMode.DRIVING)
      ? google.maps.TravelMode.WALKING
      : google.maps.TravelMode.DRIVING;

    $('#toggle-mode').text(
      travelMode === google.maps.TravelMode.DRIVING
        ? 'Passer en mode piéton'
        : 'Passer en mode voiture'
    );
     //updateRouteWith(travelMode); 
  });

   $(document).on('click', '.show-details', function () {
    const $el = $(this);
    $('#modalNom').text($el.data('nom'));
    $('#modalQuartier').text($el.data('quartier'));
    $('#modalVille').text($el.data('ville'));
    $('#modalSpecialite').text($el.data('type'));
    $('#modalSiteweb').text($el.data('siteWeb'));
    $('#modalTelephone').text($el.data('telephone'));
    $('#helpLatitud').text($el.data('localisation.lat'));
    $('#helpLongitud').text($el.data('localisation.lng'));

    // Forcer ouverture
    //$('#myDetailsModal1').modal('show');
  }); 

  $(document).on('click', '.show-road', function () {
    const $el = $(this);
    const etabLat = parseFloat($el.data('localisation.lat'));
    const etabLng = parseFloat($el.data('localisation.lng'));
    

    if (isNaN(etabLat) || isNaN(etabLng)) {
      alert("Coordonnées de destination invalides.");
      return;
    }

    $('#helpLatitud').text(etabLat);
    $('#helpLongitud').text(etabLng);
    // Forcer ouverture
    //$('#myRoadModal1').modal('show');
    $('#myRoadModal1').off('shown.bs.modal').on('shown.bs.modal', function () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;

          map = new google.maps.Map(document.getElementById('map'), {
            zoom: 13,
            center: { lat: userLat, lng: userLng }
          });

          new google.maps.Marker({
            position: { lat: userLat, lng: userLng },
            map: map,
            title: 'Votre position',
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 6,
              fillColor: "#4285F4",
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: "#fff"
            }
          });

          new google.maps.Marker({
            position: { lat: etabLat, lng: etabLng },
            map: map,
            title: 'Etablissement sanitaire',
            icon: {
              url: "http://maps.google.com/mapfiles/ms/icons/orange-dot.png"
            }
          });

          const directionsService = new google.maps.DirectionsService();
          const directionsRenderer = new google.maps.DirectionsRenderer({
            map,
            polylineOptions: {
              strokeColor: '#FF8C00',
              strokeWeight: 5
            }
          });

          directionsService.route(
            {
              origin: { lat: userLat, lng: userLng },
              destination: { lat: etabLat, lng: etabLng },
              travelMode: travelMode,
            },
            (response, status) => {
              if (status === "OK") {
                directionsRenderer.setDirections(response);
                const leg = response.routes[0].legs[0];
                document.getElementById("distance_estime").innerText = `Distance : ${leg.distance.text}`;
                document.getElementById("duration_estime").innerText = `Durée estimée : ${leg.duration.text}`;
              } else {
                alert("Erreur lors de la génération de l’itinéraire : " + status);
              }
            }
          );
        });
      } else {
        alert("La géolocalisation n’est pas supportée par votre navigateur.");
      }
    });
  });
}

//Leaflet mgr end

Template.searchEtablissements.helpers({
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
  types() {
    // Extraction des catégories distinctes
    return _.uniq(Etablissements.find({}, { fields: { type: 1 } })
      .fetch()
      .map(med => med.type)
      .filter(Boolean)).sort(); // ignore les valeurs nulles ou vides
  }
});

Template.searchEtablissements.events({
  'submit #search-form'(event, instance) {
    event.preventDefault();
    instance.currentPage.set(1); // reset to page 1

    const nomQuery = event.target.searchQuery.value.trim();
    const selectedType = event.target.typeSelect.value;
    const selectedRegion = event.target.regionSelect.value;

    const filter = {};
    if (nomQuery) {
      filter.type = { $regex: nomQuery, $options: 'i' };
    }
    if (selectedType) {
      filter.type = selectedType;
    }

    if (selectedType) {
        filter.region = selectedRegion;
      }

    instance.lastSearchParams.set({
      filter
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
  'click .btn-call-facility'(event, instance) {
     Meteor.call('userHistory.increment', Meteor.userId(), 'calledFacility');
     //alert('Interaction en vue');
  }

});

function performSearch(instance) {
  const { filter } = instance.lastSearchParams.get();
  const page = instance.currentPage.get();

  const skip = (page - 1) * PAGE_SIZE;
  const limit = PAGE_SIZE;

  let cursor = Etablissements.find(filter, {
    skip,
    limit
  });

  const total = Etablissements.find(filter).count();

  instance.totalResults.set(total);
  instance.searchResults.set(cursor.fetch());
}
