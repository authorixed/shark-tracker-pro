const mongoose = require('mongoose');

const sharkSchema = new mongoose.Schema({
  name: String,
  species: String,
  pingCount: Number,
  location: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Shark = mongoose.model('Shark', sharkSchema);
module.exports = Shark;