const bcrypt = require('bcrypt');
const { AuthenticationError } = require('apollo-server-express');
const User = require('./models/User');
const Shark = require('./models/Shark');
const { signToken } = require('./utils/auth');

const resolvers = {
  Query: {
    sharks: async () => {
      try {
        return await Shark.find();
      } catch (err) {
        console.error('Error fetching sharks:', err.message);
        throw new Error('Failed to fetch sharks');
      }
    },
    shark: async (parent, { id }) => {
      try {
        return await Shark.findById(id);
      } catch (err) {
        console.error('Error fetching shark:', err.message);
        throw new Error('Failed to fetch the shark');
      }
    },
    currentUser: async (parent, args, context) => {
      if (!context.user) {
        throw new AuthenticationError('Not authenticated');
      }
      try {
        return await User.findById(context.user._id);
      } catch (err) {
        console.error('Error fetching current user:', err.message);
        throw new Error('Failed to fetch current user');
      }
    },
  },

  Mutation: {
    signup: async (parent, { username, password }) => {
      try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          throw new Error('Username already taken');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hashedPassword });

        const token = signToken(user);
        return { token, user };
      } catch (err) {
        console.error('Error signing up user:', err.message);
        throw new Error('Failed to sign up user');
      }
    },
    login: async (parent, { username, password }) => {
      try {
        const user = await User.findOne({ username });
        if (!user) {
          throw new AuthenticationError('User not found');
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          throw new AuthenticationError('Invalid credentials');
        }

        const token = signToken(user);
        return { token, user };
      } catch (err) {
        console.error('Error logging in user:', err.message);
        throw new Error('Failed to log in user');
      }
    },
    addShark: async (parent, { name, species, pingCount, location, timestamp }, context) => {
      if (!context.user) {
        throw new AuthenticationError('Not authenticated');
      }

      try {
        const newShark = await Shark.create({
          name,
          species,
          pingCount,
          location,
          timestamp,
          createdBy: context.user._id, // Associate with the authenticated user
        });

        return newShark;
      } catch (err) {
        console.error('Error adding shark:', err.message);
        throw new Error('Failed to add shark');
      }
    },
    deleteShark: async (parent, { id }, context) => {
      if (!context.user) {
        throw new AuthenticationError('Not authenticated');
      }

      try {
        const shark = await Shark.findByIdAndDelete(id);
        if (!shark) {
          throw new Error('Shark not found');
        }

        return "Shark successfully deleted";
      } catch (err) {
        console.error('Error deleting shark:', err.message);
        throw new Error('Failed to delete shark');
      }
    },
  },
};

module.exports = resolvers;