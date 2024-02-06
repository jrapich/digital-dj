const { User, Track, Session } = require("../models");
const { AuthTools } = require("../utils/auth");
const auth = new AuthTools();

const { DevLoggingTools } = require("../utils/dev");
const dev = new DevLoggingTools(false);

//TODO: aDD resilient error checking and handling
const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return await User.findOne({ _id: context.user._id })
          .select({ password: 0, email: 0 })
          .populate("");
      }
      auth.comparison = "username";
      auth.errorMessage = "no user is currently logged in";
      throw AuthenticationError;
    },
    user: async (parent, { username }) => {
      return await User.findOne({ username })
        .select({ password: 0, email: 0 })
        .populate();
    },
    publicSessionList: async () => {
      return await Session.find({ isPublic: true }).populate().exec();
    },
    trackQue: async (parent, { sessionID }) => {
      const Session = await Session.findById({ _id: sessionID })
        .populate()
        .exec();
      return Session.que;
    },
    history: async (parent, { sessionID }) => {
      const Session = await Session.findById({ _id: sessionID })
        .populate()
        .exec();
      return Session.history;
    },
  },
  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({
        username: username,
        email: email,
        password: password,
      }).select({ password: 0 });

      const token = auth.signToken(user);
      return { token, user };
    },
    deleteUser: async (parent, { email, password }, context) => {
      const user = await User.findOne({ email }).select({
        email: 0,
        password: 0,
      });

      if (!user) {
        auth.comparison = "email";
        auth.errorMessage = "no account with that email found";
        throw auth.AuthenticationError;
      }

      const checkPW = await user.isCorrectPassword(password);

      if (!checkPW) {
        auth.comparison = "password";
        auth.errorMessage = "incorrect password";
        throw auth.AuthenticationError;
      }

      if (user._id !== context.user._id) {
        auth.comparison = "username";
        auth.errorMessage = "cannot delete this user as you are not this user";
        dev.error(
          {
            error: "auth",
            date: new Date.now(),
            message: "user attempted to delete a different user",
            requestingUser: context.user._id,
            targetUser: user._id,
          }, true);
        throw auth.AuthenticationError;
      }

      let deleteUser;
      if (checkPW && context.user) {
        deleteUser = await User.findOneAndDelete({ email });
        dev.table(deleteUser);
      }

      return { token, deleteUser };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email }).select({
        email: 0,
        password: 0,
      });

      if (!user) {
        auth.comparison = "email";
        auth.errorMessage = "no account with that email found";
        throw auth.AuthenticationError;
      }

      const checkPW = await user.isCorrectPassword(password);

      if (!checkPW) {
        auth.comparison = "password";
        auth.errorMessage = "incorrect password";
        throw AuthenticationError;
      }

      const token = signToken(user);
      return { token, user };
    },
    addSession: async (parent,{ ownerID, isPublic, sessionName, passcode }, context) => {
      if (!context.user) {
        auth.comparison = "username";
        auth.errorMessage = "no user is currently logged in";
        throw auth.AuthenticationError;
      }

      const session = await Session.create({
        owner: context.user,
        ownerID: ownerID,
        isPublic: isPublic,
        sessionName: sessionName,
        passcode: passcode,
      }).select({passcode:0});

      dev.table(session);

      return session;
    },
    deleteSession: async (parent, sessionID, context) => {
      if (!context.user) {
        auth.comparison = "username";
        auth.errorMessage = "no user is currently logged in";
        throw auth.AuthenticationError;
      }

      const session = await Session.findById({ sessionID });
      if (!session) {
        auth.comparison = "session";
        auth.errorMessage = "no session found by that ID";
        throw auth.AuthenticationError;
      }

      if (session.ownerID !== context.user._id) {
        auth.comparison = "username";
        auth.errorMessage =
          "cannot delete this session as you are not the owner";
        dev.error(
          {
            error: "auth",
            date: new Date.now(),
            message: "user attempted to delete session but was not authorized",
            userID: context.user._id,
            session: session._id,
          }, true);
        throw auth.AuthenticationError;
      }
      //when a session is deleted we are using middleware on the model
      //to delete the tracks in it to
      //TODO: be sure to test to make sure it works!!
      const deleteSession = await Session.findByIdAndDelete({ sessionID });
      //delete the session from the user's list
      const user = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $pull: { sessionList: sessionID } },
        { new: true }
      ).select({ email: 0, password: 0 });

      //debug logging
      dev.group("deleted session result", [deleteSession]);
      dev.group("user after deleting session", [user]);

      return {
        code: 200,
        message: "session and related tracks deleted",
      };
    },
    addTrack: async (parent, { addTrack, sessionID }, context) => {
      if (!context.user) {
        auth.comparison = "username";
        auth.errorMessage = "no user is currently logged in";
        throw auth.AuthenticationError;
      }

      const session = await Session.findById({ sessionID });
      if (!session) {
        auth.comparison = "session";
        auth.errorMessage = "no session found by that id";
        throw auth.AuthenticationError;
      }

      //if we wanted to create the track in its own collection
      //const track = await Track.create({...addTrack});
      const newSession = await Session.findByIdAndUpdate(
        { _id: sessionID },
        { $addToSet: { que: addTrack } },
        { runValidators: true },
        { new: true }
      );
      //dev.table(track);
      dev.table(newSession);

      return {
        code: 200,
        message: "track added to session que",
      };
    },
    deleteTrack: async (parent, { trackID, sessionID }, context) => {
      if (!context.user) {
        auth.comparison = "username";
        auth.errorMessage = "no user is currently logged in";
        throw auth.AuthenticationError;
      }

      const session = await Session.findById({ sessionID });
      if (!session) {
        auth.comparison = "session";
        auth.errorMessage = "no session found by that id";
        throw auth.AuthenticationError;
      }
      dev.table(session);

      if (context.user !== session.ownerID) {
        (auth.comparison = "username"),
          (auth.errorMessage = "you are not the owner of this session"),
          dev.error(
            {
              error: "auth",
              date: new Date.now(),
              message:"user attempted to delete track from session que but was not authorized",
              userID: context.user._id,
              session: session._id,
              track: trackID,
            }, true);
        throw auth.AuthenticationError;
      }

      const newQue = await Session.findOneAndUpdate(
        { _id: sessionID },
        { $pull: { que: { _id: trackID } } },
        { new: true }
      );
      if (!newQue) {
        auth.comparison = "track";
        auth.errorMessage = "no track found by that id";
        throw auth.AuthenticationError;
      }
      dev.table(newQue);

      return {
        code: 200,
        message: "track deleted from session que",
      };
    },
  },
};

module.exports = resolvers;
