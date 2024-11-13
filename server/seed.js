// Import required modules
const mongoose = require('mongoose');
const Shark = require('./models/Shark'); // Adjust the path if needed based on your project structure
require('dotenv').config(); // Load environment variables from .env file

// Log the MongoDB URI to ensure it's loaded correctly
console.log('Connecting to MongoDB URI:', process.env.MONGODB_URI);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => {
  console.error('Database connection error:', error);
  process.exit(1); // Exit the process if there's a connection error
});

// Define the seed data
const seedData = [
  {
    name: 'Great White Shark',
    species: 'Carcharodon carcharias',
    pingCount: 5,
    location: 'Pacific Ocean',
    timestamp: new Date(),
  },
  {
    name: 'Tiger Shark',
    species: 'Galeocerdo cuvier',
    pingCount: 3,
    location: 'Atlantic Ocean',
    timestamp: new Date(),
  },
  {
    name: 'Hammerhead Shark',
    species: 'Sphyrna mokarran',
    pingCount: 8,
    location: 'Indian Ocean',
    timestamp: new Date(),
  },
];

// Function to seed the database
const seedDatabase = async () => {
  try {
    console.log('Deleting existing data...');
    await Shark.deleteMany(); // Clear existing data in sharks collection

    console.log('Inserting seed data...');
    await Shark.insertMany(seedData); // Insert the seed data

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close(); // Close the database connection
  }
};

// Run the seed function
seedDatabase();