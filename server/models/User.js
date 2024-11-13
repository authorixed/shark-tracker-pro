const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  favorites: [{
    type: String, // Storing location as strings for simplicity
  }],
});

const User = mongoose.model('User', userSchema);
module.exports = User;