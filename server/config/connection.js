require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.1.1:27017/SharktrackerDB');
module.exports = mongoose.connection;