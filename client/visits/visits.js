import { Template } from 'meteor/templating';
import { Visits } from '/collections/visits.js';
import { HTTP } from 'meteor/http';
import './visits.html';
import { Meteor } from 'meteor/meteor';


Template.visitsToday.onCreated(function () {
    Meteor.call('logVisit');
  this.subscribe('visits.today');
  this.subscribe('visits');
});

Template.visitsToday.helpers({
  visits() {
    return Visits.find({}, { sort: { date: -1 } });
  },
  totalVisitors() {
    // Compter les IP uniques
    const allVisits = Visits.find().fetch();
    const uniqueIPs = [...new Set(allVisits.map(v => v.ip))];
    return uniqueIPs.length;
  },
  formattedTime(date) {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  },
  todayVisits() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Visits.find({ date: { $gte: today } }).count();
  },
  todayCount() {
    const today = new Date().toISOString().split('T')[0];
    const visit = Visits.findOne({ day: today });
    return visit ? visit.count : 0;
  },
  //resultat de la methode log
  weekCount() {
    const now = new Date();
    const start = new Date(now.setDate(now.getDate() - now.getDay())); // dimanche dernier
    const end = new Date();
    const visits = Visits.find({
      day: {
        $gte: start.toISOString().split('T')[0],
        $lte: end.toISOString().split('T')[0],
      }
    }).fetch();
    return visits.reduce((sum, v) => sum + v.count, 0);
  }
});
Template.visitsToday.onRendered(function(){
    this.autorun(() => {
    const data = [];
    const labels = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const now = new Date();
    const base = new Date(now.setDate(now.getDate() - now.getDay())); // Dimanche

    for (let i = 0; i < 7; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      const key = d.toISOString().split('T')[0];
      const record = Visits.findOne({ day: key });
      data.push(record ? record.count : 0);
    }

    const ctx = document.getElementById('visitChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Visites par jour',
          data,
          backgroundColor: ['#00C896', '#0096C8', '#88D6C8', '#5EC2B5', '#33AFAD', '#00A09A', '#008C88']
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 }
          }
        }
      }
    });
  });
})