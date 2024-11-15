const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Shark = require('./models/Shark');
const User = require('./models/User');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require("./utils/auth")

// Replace 'your-secret-key' with your strong JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || 'your-strong-random-string';

const resolvers = {
  Query: {
    sharks: async () => {
      try {
        return await Shark.find();
      } catch (error) {
        throw new Error('Failed to fetch sharks');
      }
    },
    shark: async (parent, { id }) => {
      try {
        return await Shark.findById(id);
      } catch (error) {
        throw new Error('Failed to fetch shark');
      }
    },
    currentUser: async (parent, args, context) => {
      if (!context.user) {
        throw new AuthenticationError("Not authenticated");
      }
      return await User.findById(context.user._id);
    },
  },

  Mutation: {
    signup: async (parent, { username, password }) => {
      try {
        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          console.error("Username already taken");
          throw new Error('Username already taken');
        }
    
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Create the new user
        const user = new User({ username, password: hashedPassword });
        await user.save();
    
        // Generate the JWT token
        const token = signToken({ _id: user._id, username: user.username });
    
        return { token, user };
      } catch (error) {
        console.error("Error in signup:", error);
        throw new Error('Failed to sign up');
      }
    },

    login: async (parent, { username, password }) => {
      try {
        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
          throw new Error('User not found');
        }
    
        // Compare the password with the hashed password in the database
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          throw new AuthenticationError('Invalid password');
        }
    
        // Generate the JWT token
        const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    
        return { token, user };
      } catch (error) {
        console.error("Login error:", error); // Debugging output
        throw new Error('Failed to log in');
      }
    },

    // Add Shark Mutation
    addShark: async (parent, { name, species, pingCount, location, timestamp }, context) => {
      if (!context.user) {
        throw new AuthenticationError('Not authenticated');
      }
      try {
        const newShark = await Shark.create({ name, species, pingCount, location, timestamp });
        return newShark;
      } catch (error) {
        throw new Error('Failed to add shark');
      }
    },

    // Delete Shark Mutation
    deleteShark: async (parent, { id }, context) => {
      if (!context.user) {
        throw new AuthenticationError('Not authenticated');
      }
      try {
        const deletedShark = await Shark.findByIdAndDelete(id);
        if (!deletedShark) {
          throw new Error('Shark not found');
        }
        return deletedShark;
      } catch (error) {
        throw new Error('Failed to delete shark');
      }
    }
  },
};

module.exports = resolvers;