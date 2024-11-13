require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');

const app = express();

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.log('Error connecting to MongoDB:', err);
});

app.listen(4000, () => {
  console.log('Server running on http://localhost:4000');
});