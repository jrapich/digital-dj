const { User, Track, Party } = require("../models");
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
    publicPartyList: async () => {
      return await Party.find({ isPublic: true }).populate().exec();
    },
    trackQue: async (parent, { partyID }) => {
      const party = await Party.findById({ _id: partyID }).populate().exec();
      return party.que;
    },
    history: async (parent, { partyID }) => {
      const party = await Party.findById({ _id: partyID }).populate().exec();
      return party.history;
    },
  },

  Mutation: {},
};

module.exports = resolvers;
