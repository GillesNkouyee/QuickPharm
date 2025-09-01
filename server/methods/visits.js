
import { Visits } from '/collections/visits.js';
import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';


Meteor.startup(() => {
  WebApp.connectHandlers.use((req, res, next) => {
    // Récupérer l'adresse IP (x-forwarded-for peut contenir plusieurs IP séparées par des virgules)
    const forwardedFor = req.headers['x-forwarded-for'];
    const ip = forwardedFor
  ? forwardedFor.split(',')[0].trim()
  : (req.socket && req.socket.remoteAddress);
    // Définir le début de la journée
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Chercher une visite existante pour la même IP aujourd'hui
    const alreadyVisited = Visits.findOne({
      ip,
      date: { $gte: today },
    });

    // Enregistrement s'il n'y a pas encore de visite aujourd'hui
    if (!alreadyVisited) {

      try {
        Visits.insert({
        ip,
        date: new Date(),
        path: req.url,
        userAgent: req.headers['user-agent'],
      });
        
      } catch (error) {
        console.log(error)
      }
      
    }
   /*  Meteor.setInterval(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const removedCount = Visits.remove({ date: { $lt: sevenDaysAgo } });

    if (removedCount > 0) {
      console.log(`✅ Nettoyage : ${removedCount} visites supprimées`);
    }
  }, 24 * 60 * 60 * 1000); // tous les 24h  */
    next(); // Continuer la requête
  });
  
});
