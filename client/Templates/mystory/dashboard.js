import { Template } from 'meteor/templating';
import { UserHistory } from '/collections/userHistory.js';
import { Visits } from '/collections/visits.js';
import { HTTP } from 'meteor/http';

let lineChartInstance = null;
let pieChartInstance = null;

Template.dashboard.onCreated(function () {
  this.subscribe('userHistory');
  this.subscribe('visits.all'); // Assure-toi que cette publication existe
  this.visitRecap = new ReactiveVar([]);

  Meteor.call('visits.track', (err) => {
    if (err) {
      console.error('Erreur tracking :', err);
    } else {
      console.log('Visite enregistrée.');
    }
  });
});

Template.dashboard.onRendered(function () {
  const instance = this;

  instance.autorun(() => {
    const rawData = Visits.find({}).fetch();

    const counts = Array(7).fill(0);
    rawData.forEach(({ date, count }) => {
      const d = new Date(date);
      const day = d.getDay(); // 0 (dimanche) à 6 (samedi)
      counts[day] += count;
    });

    const ctxLine = document.getElementById('lineChart')?.getContext('2d');
    if (!ctxLine) return;

    if (lineChartInstance) {
      lineChartInstance.destroy();
    }

    lineChartInstance = new Chart(ctxLine, {
      type: 'bar',
      data: {
        labels: ['Dim','Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
        datasets: [{
          label: 'Visites',
          data: counts,
          backgroundColor: 'rgba(46, 204, 113, 0.2)',
          borderColor: '#2ecc71',
          borderWidth: 2,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  });

  instance.autorun(() => {
    const data = UserHistory.findOne({ userId: Meteor.userId() });
    if (!data) return;

    const ctxPie = document.getElementById('pieChart')?.getContext('2d');
    if (!ctxPie) return;

    if (pieChartInstance) {
      pieChartInstance.destroy();
    }

    pieChartInstance = new Chart(ctxPie, {
      type: 'doughnut',
      data: {
        labels: [
          'Appels Soignants',
          'Appels Établissements',
          'Pharmacies Visitées',
          'Recherches Médicaments',
          'Comparaisons Prix'
        ],
        datasets: [{
          data: [
            data.calledPersonnel || 0,
            data.calledFacility || 0,
            data.visitedPharmacy || 0,
            data.searchedDrug || 0,
            data.comparedPrices || 0
          ],
          backgroundColor: [
            '#2ecc71',
            '#3498db',
            '#f1c40f',
            '#e74c3c',
            '#9b59b6'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  });
});

Template.dashboard.helpers({
  history() {
    return UserHistory.findOne({ userId: Meteor.userId() });
  }
});

Template.dashboard.events({});
