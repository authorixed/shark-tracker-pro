const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const cors = require('cors');
const path = require('path');
const db = require('./config/connection');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const { authMiddleware } = require('./utils/auth'); // Import authMiddleware

// Environment variables and port
const PORT = process.env.PORT || 3001;

// Initialize Express app
const app = express();

// Middleware for JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Create Apollo Server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true, // Enable introspection for development
});

// Function to start Apollo Server
const startApolloServer = async () => {
  try {
    // Start Apollo Server
    await server.start();

    // Apply Apollo middleware with custom context
    app.use(
      '/graphql',
      cors(), // Enable CORS
      expressMiddleware(server, {
        context: async ({ req }) => {
          // Apply authMiddleware to attach the user to the context
          const context = await authMiddleware({ req });
          return context;
        },
      })
    );

    // Serve static assets in production
    if (process.env.NODE_ENV === 'production') {
      app.use(express.static(path.join(__dirname, '../client/build')));
      app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build/index.html'));
      });
    }

    // Connect to the database and start the server
    db.once('open', () => {
      app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`);
        console.log(`GraphQL available at http://localhost:${PORT}/graphql`);
      });
    });
  } catch (err) {
    console.error('Failed to start Apollo Server:', err.message);
  }
};

// Start the server
startApolloServer();