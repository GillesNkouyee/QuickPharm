import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { check } from 'meteor/check';

Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.methods({
  commanderYango(pickup, dropoff) {
    check(pickup, { lat: Number, lng: Number });
    check(dropoff, { lat: Number, lng: Number });

    // MOCK de réponse API Yango
    const fakeResponse = {
      status: 'ok',
      car_assigned: true,
      eta_minutes: 5,
      driver_name: 'Jean-Paul',
      car_model: 'Toyota Corolla',
      tracking_url: 'https://yango.mock/tracking/123456'
    };

    return fakeResponse;
  }
});
/* Meteor.methods({
  commanderYango(pickup, dropoff) {
    check(pickup, { lat: Number, lng: Number });
    check(dropoff, { lat: Number, lng: Number });

    const apiKey = Meteor.settings.private.YANGO_API_KEY;

    const endpoint = "https://fleet-api.taxi.yandex.net/v1/parks/order"; // à confirmer selon ton accès
    const payload = {
      source: {
        latitude: pickup.lat,
        longitude: pickup.lng,
      },
      destination: {
        latitude: dropoff.lat,
        longitude: dropoff.lng,
      },
      requirements: {
        // options de trajet (si besoin)
      },
      // Peut inclure park_id, driver_profile_id, etc., selon ton contrat
    };

    try {
      const response = HTTP.call("POST", endpoint, {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        data: payload,
      });

      return response.data;
    } catch (error) {
      console.error("Erreur commande Yango:", error);
      throw new Meteor.Error("yango.error", error.message);
    }
  }
}); */
