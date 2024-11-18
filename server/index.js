const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const db = require('./config/connection');
const { typeDefs, resolvers } = require('./schemas');
require('dotenv').config(); // Ensure environment variables are loaded

const PORT = process.env.PORT || 3001;
const app = express();

// Middleware for parsing request body
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Optional: Enable CORS
const cors = require('cors');
app.use(cors());

// Set up Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // Pass headers for authentication if needed
    const token = req.headers.authorization || '';
    return { token };
  },
});

// Start the Apollo Server and apply middleware to Express
async function startApolloServer() {
  try {
    await server.start();
    server.applyMiddleware({ app });

    // Serve static files in production
    if (process.env.NODE_ENV === 'production') {
      app.use(express.static(path.join(__dirname, '../client/build')));
    }

    // Catch-all route for React front-end
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/build/index.html'));
    });

    // Connect to MongoDB and start the Express server
    db.once('open', () => {
      app.listen(PORT, () => {
        console.log(`🌍 API server running on port ${PORT}!`);
        console.log(`🚀 GraphQL available at http://localhost:${PORT}${server.graphqlPath}`);
      });
    });

    db.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
  }
}

// Start the server
startApolloServer();