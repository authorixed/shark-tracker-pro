const jwt = require('jsonwebtoken');

// Use your strong secret key here
const secret = 'your-strong-random-string';
const expiration = '2h'; // Tokens will expire in 2 hours for added security

module.exports = {
  // Function to sign a token with user data
  signToken: function ({ username, _id }) {
    const payload = { username, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },

  // Middleware to verify tokens for protected routes
  authMiddleware: function ({ req }) {
    let token = req.body.token || req.query.token || req.headers.authorization;

    if (token) {
      // Remove "Bearer " prefix if present
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      return req;
    }

    try {
      const {data} = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data; // Attach the user data to the request
    } catch (exception) {
      console.log('Invalid token');
    }

    return req; // Return the request object with or without user data
  },
};