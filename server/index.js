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

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Enable CORS
const cors = require('cors');
app.use(cors());

// Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware, // Correctly pass the authMiddleware
});

async function startApolloServer() {
  try {
    await server.start();
    server.applyMiddleware({ app });

    // Serve static files if in production
    if (process.env.NODE_ENV === 'production') {
      app.use(express.static(path.join(__dirname, '../client/build')));
      app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build/index.html'));
      });
    }

    db.once('open', () => {
      app.listen(PORT, () => {
        console.log(`🌍 API server running on port ${PORT}!`);
        console.log(`🚀 GraphQL available at http://localhost:${PORT}${server.graphqlPath}`);
      });
    });
  } catch (err) {
    console.error('Error starting Apollo Server:', err.message);
  }
}

startApolloServer();