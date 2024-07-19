//import dependencies
const { signToken, AuthenticationError } = require('../utils/auth');
const { User } = require('../models');

const resolvers = {
    Query:{
        //get the user/saved books
        me: async (parent, args, context) => {
            if (context.user) {
                return User.findOne({ _id: context.user._id}).populate('savedBooks');
            }
            throw AuthenticationError("User not authenticated.");
        },
    },

    Mutation: {
        //log the user in.
        login: async (parent, { email, password }) => {
            const user = await User.findOne(( email));

            if (!user) {
                throw AuthenticationError("Can't find user.");
            }

            const correctPW = await user.isCorrectPassword(password);

            if (!correctPW) {
                throw AuthenticationError("Wrong password.");
            }

            const token = signToken(user);
            return { token, user };
        },
        //adding user
        addUser: async (parent, args) => {
            const user = await User.create(args);

            if(!user){
                throw AuthenticationError("Something went wrong");
            }
            
            const token = signToken(user);
            return { token, user};
        },
        //saving a book to user
        saveBook: async (parent , args, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: user._id},
                    { $addToSet: {savedBooks: args.body}},
                    { new: true, runValidators: true }
                ).populate('savedBooks')
                return updatedUser;
            }
            throw AuthenticationError('Your are not authenticated');
        },
        // deleting a book from user
        removeBook: async (parent, { bookId}, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id},
                    { $pull: {savedBooks: { bookId}}},
                    { new: true}
                ).populate('savedBooks');
                return updatedUser;
            }
            throw AuthenticationError("You are not authenticated");
        },
    }
};

module.exports = resolvers;