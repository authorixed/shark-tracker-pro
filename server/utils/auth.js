const jwt = require('jsonwebtoken');

// Secret and expiration settings
const secret = process.env.JWT_SECRET || 'fallback-random-secret';
const expiration = '2h';

module.exports = {
  /**
   * Signs a new token for the user using their username and _id.
   * @param {Object} user - The user object, containing username and _id.
   * @returns {string} - A signed JWT token.
   */
  signToken: ({ username, _id }) => {
    const payload = { username, _id };
    try {
      const token = jwt.sign({ data: payload }, secret, { expiresIn: expiration });
      console.log('Token generated successfully:', token);
      return token;
    } catch (err) {
      console.error('Error signing token:', err.message);
      throw new Error('Error generating token');
    }
  },

  /**
   * Middleware to authenticate a token from the request.
   * Attaches the user data to req.user if the token is valid.
   * @param {Object} req - The incoming request object.
   * @returns {Object} - The modified request object.
   */
  authMiddleware: ({ req }) => {
    let token = req.headers.authorization;

    // Log the received token
    console.log('Authorization Header:', token);

    if (!token) {
      console.warn('No token provided');
      req.user = null;
      return req;
    }

    // Remove "Bearer" prefix if present
    if (token.startsWith('Bearer ')) {
      token = token.slice(7).trim();
    }

    console.log('Token after stripping Bearer:', token);

    try {
      // Verify the token and attach the decoded payload to req.user
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
      console.log('Decoded user:', req.user); // Log decoded user details
    } catch (err) {
      console.error('Token verification failed:', err.message);
      req.user = null; // Set user to null if token is invalid
    }

    return req;
  },

  /**
   * Verifies a JWT token and returns the decoded user data.
   * Can be used outside middleware.
   * @param {string} token - The JWT token to verify.
   * @returns {Object|null} - Decoded user data if valid, or null if invalid.
   */
  verifyToken: (token) => {
    if (!token) {
      console.warn('No token provided for verification');
      return null;
    }

    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      console.log('Token verified successfully:', data);
      return data;
    } catch (err) {
      console.error('Token verification failed:', err.message);
      return null;
    }
  },
};