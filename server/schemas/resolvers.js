const { User, Track, Session } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");

const { DevLoggingTools } = require("../utils/dev");
const dev = new DevLoggingTools();

//TODO: aDD resilient error checking and handling
const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return await User.findOne({ _id: context.user._id }).populate("");
      }
      throw AuthenticationError;
    },
    user: async (parent, { username }) => {
      return await User.findOne({ username }).populate();
    },
    publicSessionList: async () => {
      return await Session.find({ isPublic: true }).populate().exec();
    },
    trackQue: async (parent, { sessionID }) => {
      const Session = await Session.findById({ _id: sessionID }).populate().exec();
      return Session.que;
    },
    history: async (parent, { sessionID }) => {
      const Session = await Session.findById({ _id: sessionID }).populate().exec();
      return Session.history;
    },
  },

  Mutation: {},
};

module.exports = resolvers;
