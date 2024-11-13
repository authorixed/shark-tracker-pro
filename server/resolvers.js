const Shark = require('./models/Shark'); // Import your Mongoose models
const User = require('./models/User');

const resolvers = {
    Query: {
        sharks: async () => {
            try {
                return await Shark.find();
            } catch (error) {
                throw new Error("Failed to fetch sharks:", error);
            }
        },
        user: async (parent, args) => {
            try {
                return await User.findById(args.id);
            } catch (error) {
                throw new Error("Failed to fetch user:", error);
            }
        }
    },
    Mutation: {
        addShark: async (parent, args) => {
            try {
                const newShark = new Shark(args);
                return await newShark.save();
            } catch (error) {
                throw new Error("Failed to add shark:", error);
            }
        },
        addUser: async (parent, args) => {
            try {
                const newUser = new User(args);
                return await newUser.save();
            } catch (error) {
                throw new Error("Failed to add user:", error);
            }
        },
        addFavorite: async (parent, args) => {
            try {
                const user = await User.findById(args.userId);
                if (!user) throw new Error("User not found");
                user.favorites.push(args.location);
                await user.save();
                return user;
            } catch (error) {
                throw new Error("Failed to add favorite location:", error);
            }
        }
    }
};

module.exports = resolvers;