const jwt = require('jsonwebtoken');

// Secret and expiration settings
const secret = process.env.JWT_SECRET || 'your-strong-random-string';
const expiration = '2h';

module.exports = {
  /**
   * Signs a new token for the user using their username and _id.
   * @param {Object} user - The user object, containing username and _id.
   * @returns {string} - A signed JWT token.
   */
  signToken: function ({ username, _id }) {
    const payload = { username, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },

  /**
   * Middleware to authenticate a token from the request.
   * Attaches the user data to req.user if the token is valid.
   * @param {Object} req - The incoming request object.
   * @returns {Object} - The modified request object.
   */
  authMiddleware: ({ req }) => {
    // Get token from Authorization header
    let token = req.headers.authorization || '';

    // Remove "Bearer" if present
    if (token.startsWith('Bearer ')) {
      token = token.slice(7).trim();
    }

    try {
      // Verify the token and attach the decoded payload to req.user
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
      console.log('Authenticated user:', req.user); // Debugging output
    } catch (err) {
      console.error('Token verification failed:', err.message); // Log error for debugging
      req.user = null; // Set user to null if token is invalid
    }

    // Return the modified request object
    return req;
  },

  /**
   * Verifies a JWT token and returns the decoded user data.
   * @param {string} token - The JWT token to verify.
   * @returns {Object|null} - Decoded user data if valid, or null if invalid.
   */
  verifyToken: function (token) {
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      console.log('Token verified in verifyToken function:', data); // Debugging output
      return data;
    } catch (err) {
      console.error('Invalid token in verifyToken:', err.message); // Log error for debugging
      return null; // Return null if token is invalid
    }
  },
};