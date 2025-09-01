import { Mongo } from 'meteor/mongo';

export const Visits = new Mongo.Collection('visits');

const VisitsSchema = new SimpleSchema({
  ip: {
    type: String,
    label: "Adresse IP",
    regEx: SimpleSchema.RegEx.IP,
    optional: true,
  },
  date: {
    type: Date,
    label: "Date de la visite",
    optional: true,
  },
  path: {
    type: String,
    label: "URL visitée",
    optional: true,
  },
  userAgent: {
    type: String,
    label: "Agent utilisateur",
    optional: true,
  },
  count: {
    type: Number,
    label: "Nombre de visites",
    defaultValue: 1,
    optional: true,
  },
  day: {
    type: String,
    regEx: /^\d{4}-\d{2}-\d{2}$/ // format ISO 8601 : "2025-08-06"
  },
});

Visits.attachSchema(VisitsSchema);
