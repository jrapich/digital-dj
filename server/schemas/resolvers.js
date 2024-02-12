const { User, Track, Session } = require("../models");
const {
  DevLoggingTools,
  AuthTools,
  GraphQLErrorData,
  AuthenticationError,
  QueryError,
  MutationError,
  mongoErrorThrower,
} = require("../utils");
const auth = new AuthTools();
const query = new GraphQLErrorData("query");
const mutation = new GraphQLErrorData("mutation");
const dev = new DevLoggingTools(false);

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      dev.group("me query context", [context.user]);
      query.setReason = "username";
      query.username = context.user.username;
      let user;
      if (context.user) {
        user = await User.findOne({ _id: context.user._id })
          .select({ password: 0, email: 0 })
          .populate("");
      } else {
        query.errorMessage = "no valid user is currently logged in";
        query.statusCode = 401;
        throw new AuthenticationError("me", query);
      }
      if (!user) {
        query.errorMessage = "user not found";
        query.statusCode = 404;
        throw new QueryError("me", query);
      }

      return user;
    },
    user: async (parent, { username }) => {
      dev.multiLog(false, "query user args:", username);
      query.setReason = "username";
      query.username = username;
      let user;
      if (username) {
        user = await User.findOne({ username })
          .select({ password: 0, email: 0 })
          .populate({ path: "sessionList" })
          .exec();
      } else {
        query.errorMessage = "no username provided";
        query.statusCode = 400;
        throw new QueryError("user", query);
      }
      if (!user) {
        query.errorMessage = `username ${username} not found`;
        query.statusCode = 404;
        throw new QueryError("user", query);
      }

      return user;
    },
    publicSessionList: async () => {
      dev.log("query: all public sessions");
      return await Session.find({ isPublic: true }).populate().exec();
    },
    trackQue: async (parent, { sessionID }, context) => {
      dev.log(`query to session que ${sessionID}`);
      query.username = context.user.username;
      query.setReason = "sessionID";
      let session;
      if (sessionID) {
        session = await Session.findById({ _id: sessionID })
          .populate({ path: "que" })
          .exec();
      } else {
        query.errorMessage = "no session ID provided";
        query.statusCode = 400;
        throw new QueryError("trackQue", query);
      }
      if (!session) {
        query.errorMessage = "session ID doesn't exist";
        query.statusCode = 404;
        throw new QueryError("trackQue", query);
      }

      return session.que;
    },
    history: async (parent, { sessionID }, context) => {
      dev.log(`query to session history ${sessionID}`);
      query.username = context.user.username;
      query.setReason = "sessionID";
      let session;
      if (sessionID) {
        session = await Session.findById({ _id: sessionID })
          .populate({ path: "history" })
          .exec();
      } else {
        query.errorMessage = "no session ID provided";
        query.statusCode = 400;
        throw new QueryError("history", query);
      }
      if (!session) {
        query.errorMessage = "session ID doesn't exist";
        query.statusCode = 404;
        throw new QueryError("history", query);
      }

      return session.history;
    },
  },
  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      dev.multiLog(
        false,
        "addUser mutation:",
        "username",
        username,
        "email",
        email
      );
      let user;
      mutation.username = username;
      mutation.setReason = "user creation";
      try {
        user = await User.create({
          username: username,
          email: email,
          password: password,
        });
        user = await User.findOne({ username: username });
      } catch (err) {
        dev.groupError("addUser", [err.errors]);
        mongoErrorThrower("addUser", mutation, err);
      }

      user.password = null;
      const token = auth.signToken(user);
      dev.group("token and user", [token, user]);
      return { token, user };
    },
    deleteUser: async (parent, { email, password }, context) => {
      let user;
      mutation.username = context.user;
      mutation.setReason = "user deletion";
      user = await User.findOne({ email });

      if (!user) {
        mutation.setReason = "email";
        mutation.errorMessage = "no account with that email found";
        mutation.statusCode = 404;
        throw new MutationError("deleteUser", mutation);
      }

      const checkPW = await user.isCorrectPassword(password);

      if (!checkPW) {
        mutation.setReason = "password";
        mutation.errorMessage = "incorrect password";
        mutation.statusCode = 401;
        throw new AuthenticationError("deleteUser", mutation);
      }

      if (user.email !== context.user.email) {
        mutation.setReason = "username";
        mutation.errorMessage =
          "cannot delete this user as you are not this user";
        mutation.statusCode = 401;
        dev.error(
          {
            error: "auth",
            date: Date.now(),
            message: "user attempted to delete a different user",
            requestingUser: context.user._id,
            targetUser: user._id,
          },
          true
        );
        throw new AuthenticationError("deleteUser", mutation);
      }

      let deleteUser;
      if (checkPW && context.user) {
        deleteUser = await User.findOneAndDelete({ email }).select({
          password: 0,
        });
        dev.group("deleted user", [deleteUser]);
      }

      return {
        token: "none",
        deleteUser,
      };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email }).select({
        email: 0,
        password: 0,
      });

      if (!user) {
        auth.setReason = "email";
        auth.errorMessage = "no account with that email found";
        throw auth.AuthenticationError;
      }

      const checkPW = await user.isCorrectPassword(password);

      if (!checkPW) {
        auth.setReason = "password";
        auth.errorMessage = "incorrect password";
        throw AuthenticationError;
      }

      const token = signToken(user);
      return { token, user };
    },
    addSession: async (
      parent,
      { ownerID, isPublic, sessionName, passcode },
      context
    ) => {
      if (!context.user) {
        auth.setReason = "username";
        auth.errorMessage = "no user is currently logged in";
        throw auth.AuthenticationError;
      }

      const session = await Session.create({
        owner: context.user,
        ownerID: ownerID,
        isPublic: isPublic,
        sessionName: sessionName,
        passcode: passcode,
      }).select({ passcode: 0 });

      dev.table(session);

      return session;
    },
    deleteSession: async (parent, sessionID, context) => {
      if (!context.user) {
        auth.setReason = "username";
        auth.errorMessage = "no user is currently logged in";
        throw auth.AuthenticationError;
      }

      const session = await Session.findById({ sessionID });
      if (!session) {
        auth.setReason = "session";
        auth.errorMessage = "no session found by that ID";
        throw auth.AuthenticationError;
      }

      if (session.ownerID !== context.user._id) {
        auth.setReason = "username";
        auth.errorMessage =
          "cannot delete this session as you are not the owner";
        dev.error(
          {
            error: "auth",
            date: Date.now(),
            message: "user attempted to delete session but was not authorized",
            userID: context.user._id,
            session: session._id,
          },
          true
        );
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
        auth.setReason = "username";
        auth.errorMessage = "no user is currently logged in";
        throw auth.AuthenticationError;
      }

      const session = await Session.findById({ sessionID });
      if (!session) {
        auth.setReason = "session";
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
        auth.setReason = "username";
        auth.errorMessage = "no user is currently logged in";
        throw auth.AuthenticationError;
      }

      const session = await Session.findById({ sessionID });
      if (!session) {
        auth.setReason = "session";
        auth.errorMessage = "no session found by that id";
        throw auth.AuthenticationError;
      }
      dev.table(session);

      if (context.user !== session.ownerID) {
        (auth.setReason = "username"),
          (auth.errorMessage = "you are not the owner of this session"),
          dev.error(
            {
              error: "auth",
              date: Date.now(),
              message:
                "user attempted to delete track from session que but was not authorized",
              userID: context.user._id,
              session: session._id,
              track: trackID,
            },
            true
          );
        throw auth.AuthenticationError;
      }

      const newQue = await Session.findOneAndUpdate(
        { _id: sessionID },
        { $pull: { que: { _id: trackID } } },
        { new: true }
      );
      if (!newQue) {
        auth.setReason = "track";
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
