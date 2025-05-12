const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  title: String,
  description: String,
  mediaUrl: String,
  reportType: String,
  location: {
    lat: Number,
    lng: Number
  },
  timestamp: String,
});

const Alert = mongoose.model('Alert', alertSchema);

module.exports = Alert;
