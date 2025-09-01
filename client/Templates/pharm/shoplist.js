this.maliste = new ReactiveVar([]);
const itemsPerPage = 9;
const currentPage = new ReactiveVar(1);
var SearchData = new ReactiveVar(null);
var map;
var popup;
var Markers = [];
var infowindow = null;

Template.shoplist.onCreated(function () {
  maliste.set(Shop.find({}, { sort: { createdAt: -1 } }).fetch());

  this.autorun(() => {
    this.subscribe('list');
  });

  this.autorun(() => {
    const page = currentPage.get();
    this.subscribe('paginatedShops', page, itemsPerPage);
  });

  Blaze._allowJavascriptUrls();
});

Template.shoplist.onRendered(function () {
  $(window).on('load', function () {
    $('.post-module').hover(function () {
      $(this).find('.description').stop().animate({
        height: 'toggle',
        opacity: 'toggle',
      }, 300);
    });
  });

  const addMarkersToMap = function (activeMap) {
    if (!activeMap) {
      console.log('Map non initialisée!');
      return;
    }

    Markers.forEach(marker => marker.setMap(null));
    Markers = [];

    const Shops = Shop.find().fetch();
    Shops.forEach((shop, i) => {
      const { lat, lng } = shop.location;
      const pharmtitle = shop.shopname;
      const pharmaddress = shop.shopadress;
      const pictof = shop.shoplogo;
      const url = Articles.findOne(pictof)?.original?.name || '';
      const slogan = shop.shopslogan;
      const guardstatus = shop.garde;

      if (i === 0) {
        activeMap.setCenter(new google.maps.LatLng(lat, lng));
      }

      const marker = new google.maps.Marker({
        position: { lat, lng },
        map: activeMap,
        title: pharmtitle,
        icon: 'mapicons/medicine.png',
      });

      const contentString = `
        <div style="margin:0 0 0 5px;">
          <b>${pharmtitle}</b>
          <img src="${url}" class="img-responsive"/>
          <h5 style="text-align:center;">${slogan}</h5><br>
          <b>Location:</b> ${pharmaddress}
        </div>`;

      marker.addListener('click', function () {
        if (!infowindow) infowindow = new google.maps.InfoWindow();
        infowindow.setContent(contentString);
        infowindow.open(activeMap, marker);

        if (guardstatus === 'oui') {
          toastr.error('Cette pharmacie est de garde!', {
            closeButton: true,
            positionClass: 'toast-bottom-right',
          });
        }

        console.log('clicked on ', shop);
      });

      Markers.push(marker);
    });

    $('#ville').off('change').on('change', function () {
      const selectedVille = $('#ville option:selected').text();
      const shops = Shop.find().fetch();
      shops.forEach((shop, i) => {
        if (selectedVille === 'ALL' || selectedVille === shop.ville) {
          Markers[i].setVisible(true);
        } else {
          Markers[i].setVisible(false);
        }
      });
    });
  };

  Tracker.afterFlush(() => {
    const egfLocation = { lat: 4.070000, lng: 9.712054 };
    const mapElement = document.getElementById('searchMapContainer');

    if (mapElement) {
      map = new google.maps.Map(mapElement, {
        center: egfLocation,
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        streetViewControl: true,
        scaleControl: true,
        draggable: true,
        styles: [
          { featureType: 'poi.business', stylers: [{ visibility: 'off' }] },
          { elementType: 'geometry', stylers: [{ color: '#e0f7fa' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#00796b' }] },
        ],
      });

      google.maps.event.addListenerOnce(map, 'idle', () => {
        addMarkersToMap(map);
      });

      new google.maps.Marker({
        position: egfLocation,
        map,
        title: 'EGF-IT Consulting SARL',
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        },
      });
    } else {
      console.error("🛑 Élément DOM 'searchMapContainer' introuvable !");
    }
  });
});
Template.shoplist.helpers({
    shops() {
      return Shop.find({}, { skip: (currentPage.get() - 1) * itemsPerPage, limit: itemsPerPage });
    },
    page() {
      return currentPage.get();
    },
    list: function(){
      
        return ;
    },
    listItem() {
    return maliste.get() instanceof Mongo.Cursor 
      ? maliste.get().count() 
      : maliste.get().length;
  },
    counter() {
    return Template.instance(this._id).counter.get();
    },
    files: function() {
    return Articles.findOne({ShopId: this._id});
    },
    pharmstatusClass: function(){
      if (this.garde == "non"){
        return "label label-large label-important   hidden";
      } else {
        return "label label-large label-important ";
      }
    },
    
    newshopClass: function(){
    var start = this.createdAt;
    var end   = new Date();
    var diff  = new Date(end - start);
    var days  = diff/1000/60/60/24;

    if (days > 1) {
      return 'label label-default newshop hidden';
      } else {
        return 'label label-danger newshop ';
      }
    },
    /*upvotedClass: function() {
    var userId = Meteor.userId();
    if (userId && !_.include(this.upvoters, userId)) {
      return 'btn-primary upvotable';
    } else {
      return 'disabled';
    }
  }
  // {{upvotedClass}}
  */
 //gestion des filtres sur la map
  geolocationError() {
    var error = Geolocation.error();
    return error && error.message;
  },
  uniqueCities() {
    if (typeof shop !== 'undefined') {
      const cities = Shop.find({}, { fields: { region: 1 } }).fetch();
      return _.uniq(cities.map(p => p.region));
    } else {
      console.error("Collection Pharmacies non définie");
      return [];
    }
  }
});
Template.count.helpers({
    commentsCount: function() {
      return Comments.find({ShopId: this._id}).count();
    }
});
Template.ArticleCount.helpers({
    ShopArticlesCount: function() {
      return Articles.find({fileShopId: this._id}).count();
    }
});
Template.shoplist.events({
  'click #likebtn'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);

  },
  'click #galery': function() {
    return Shop.findOne({_id:Router.current().params._id});
  },
  'click .upvotable': function(e) {
    e.preventDefault();
    Meteor.call('upvote', this._id);
  },
  'click .next-page'(event, template) {
    currentPage.set(currentPage.get() + 1);
  },
  'click .prev-page'(event, template) {
    if (currentPage.get() > 1) {
      currentPage.set(currentPage.get() - 1);
    }
  },
  'click .btn-call-visite'(event, instance) {
     var visitedPharmacy  = Shop.findOne({_id:this._id}).shopowner;
     Meteor.call('userHistory.increment', Meteor.userId(), 'visitedPharmacy');
    
     console.log('Interaction créée sur la pharmacie',visitedPharmacy);
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

