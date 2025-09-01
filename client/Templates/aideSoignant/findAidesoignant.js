
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './findAidesoignant.html';

export const PAGE_SIZE = 6;

Template.findAidesoignant.onCreated(function () {
  this.searchResults = new ReactiveVar([]);
  this.currentPage = new ReactiveVar(1);
  this.totalResults = new ReactiveVar(0);
  this.lastSearchParams = new ReactiveVar({});
  this.calledPersonnel = new ReactiveVar(0);
});

Template.findAidesoignant.onRendered(function () {
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
            //loadLeafletFallback(userLat, userLng, etabLat, etabLng);
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
    L.marker([etabLat, etabLng]).addTo(map).bindPopup("Personnel soignant");

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
    $('#toggle-mode').text(travelMode === 'DRIVING' ? 'Passer en mode piéton' : 'Passer en mode voiture');
  });

  $(document).on('click', '.show-details', function () {
    const $el = $(this);
    $('#modalNom').text($el.data('nom'));
    $('#modalPrenom').text($el.data('prenom'));
    $('#modalSpecialite').text($el.data('specialite'));
    $('#modalDisponible').text($el.data('disponible'));
    $('#modalTelephone').text($el.data('telephone'));
    $('#helpLat').text($el.data('localisation.lat'));
    $('#helpLong').text($el.data('localisation.lng'));
  });

  $(document).on('click', '.show-road', function () {
    const $el = $(this);
    const etabLat = parseFloat($el.data('localisation.lat'));
    const etabLng = parseFloat($el.data('localisation.lng'));

    if (isNaN(etabLat) || isNaN(etabLng)) {
      alert("Coordonnées de destination invalides.");
      return;
    }

    $('#helpLat').text(etabLat);
    $('#helpLong').text(etabLng);

    $('#myRoadModal').off('shown.bs.modal').on('shown.bs.modal', function () {
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
            title: 'Personnel soignant',
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
                document.getElementById("distance").innerText = `Distance : ${leg.distance.text}`;
                document.getElementById("duration").innerText = `Durée estimée : ${leg.duration.text}`;
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

Template.findAidesoignant.helpers({
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
  /* isloggedUser( currentUser ) {
    if ( Meteor.userId() === userId ) {
      return currentUser === Meteor.userId() ? "disabled" : "";
    }
  }, */
  specialites() {
    return _.uniq(
      AideSoignants.find({}, { fields: { specialite: 1 } })
        .fetch()
        .map(med => med.specialite)
        .filter(Boolean)
    ).sort();
  }
});

Template.findAidesoignant.events({
  'submit #search-form'(event, instance) {
    event.preventDefault();
    instance.currentPage.set(1);

    const nomQuery = event.target.searchQuery.value.trim();
    const selectedDispo = event.target.dispoSelect.value;

    const filter = {};
    if (nomQuery) {
      filter.specialite = { $regex: nomQuery, $options: 'i' };
    }
    if (selectedDispo) {
      filter.disponible = selectedDispo;
    }

    instance.lastSearchParams.set({ filter });
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
    'click .btn-call-soignant'(event, instance) {
     Meteor.call('userHistory.increment', Meteor.userId(), 'calledPersonnel');
     //alert('Interaction en vue');
  },
  'submit #yango-form'(event) {
      event.preventDefault();
  
      const pickup = {
        lat: parseFloat(document.getElementById('pickup-lat').value),
        lng: parseFloat(document.getElementById('pickup-lng').value),
      };
      const dropoff = {
        lat: parseFloat(document.getElementById('dropoff-lat').value),
        lng: parseFloat(document.getElementById('dropoff-lng').value),
      };
  
      Meteor.call('commanderYango', pickup, dropoff, (err, res) => {
        const resultDiv = document.getElementById('result');
        if (err) {
          resultDiv.innerText = 'Erreur : ' + err.reason;
        } else {
          resultDiv.innerText = 'Réponse Yango :\n' + JSON.stringify(res, null, 2);
        }
      });
    }

});

function performSearch(instance) {
  const { filter } = instance.lastSearchParams.get();
  const page = instance.currentPage.get();
  const skip = (page - 1) * PAGE_SIZE;
  const limit = PAGE_SIZE;

  let cursor = AideSoignants.find(filter, { skip, limit });
  const total = AideSoignants.find(filter).count();

  instance.totalResults.set(total);
  instance.searchResults.set(cursor.fetch());
}
/* Meteor.call('commanderYango', 
  { lat: soignantLat, lng: soignantLng }, 
  { lat: userLat, lng: userLng }, 
  (err, res) => {
    if (err) {
      alert("Erreur lors de la commande Yango : " + err.reason);
    } else {
      alert("Course commandée ! 🚗 Détails : " + JSON.stringify(res));
    }
  }
);
 */