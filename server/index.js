const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const path = require('path');
const db = require('./config/connection');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const { authMiddleware } = require('./utils/auth');
require('dotenv').config();

const PORT = process.env.PORT || 3001;
const app = express();

// Middleware to parse incoming requests
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Enable CORS
const cors = require('cors');
app.use(cors());

// Apollo Server setup
async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware, // Pass the auth middleware for JWT validation
  });

  try {
    // Start the Apollo server
    await server.start();

    // Apply Apollo middleware to the Express app
    server.applyMiddleware({ app });

    // Serve static files if in production
    if (process.env.NODE_ENV === 'production') {
      app.use(express.static(path.join(__dirname, '../client/build')));
      app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build/index.html'));
      });
    }

    // Connect to the database and start the server
    db.once('open', () => {
      app.listen(PORT, () => {
        console.log(`🌍 API server running on http://localhost:${PORT}`);
        console.log(`🚀 GraphQL available at http://localhost:${PORT}${server.graphqlPath}`);
      });
    });

    db.on('error', (err) => {
      console.error('Database connection error:', err.message);
    });
  } catch (err) {
    console.error('Error starting Apollo Server:', err.message);
  }
}

// Start the server
startApolloServer();