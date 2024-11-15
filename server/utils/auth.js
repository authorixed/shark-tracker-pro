const jwt = require('jsonwebtoken');

// Ensure this secret is consistent with the one in your login and signup mutations
const secret = process.env.JWT_SECRET || 'your-strong-random-string';
const expiration = '2h';

module.exports = {
  signToken: function ({ username, _id }) {
    const payload = { username, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },

  authMiddleware: function ({ req }) {
    let token = req.body.token || req.query.token || req.headers.authorization;

    // Check if the token is provided
    if (token) {
      // Remove "Bearer" if present
      token = token.split(' ').pop().trim();
      console.log('Token received:', token); // Logging the token for verification
    } else {
      console.log('No token provided'); // Indicate if no token is found
      return req; // Return the request as is if no token is present
    }

    try {
      // Verify the token and attach the decoded payload to req.user
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
      console.log('Token verified, user data:', req.user); // Log the user data after verification
    } catch (exception) {
      console.log('Invalid token:', exception.message); // Log details if token verification fails
    }

    return req; // Return the modified request with user data attached if verified
  },
};