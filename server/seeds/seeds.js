const db = require("../config/connection");
const { DevLoggingTools } = require("../utils");
const dev = new DevLoggingTools(true);
const { User, Track, Session } = require("../models");

const users = require("./userSeeds.json");
const tracks = require("./trackSeeds.json");
const sessions = require("./sessionSeeds.json");

db.once("open", async () => {
  try {
    //only in dev environment for testing purposes
    if (!dev.isProduction) {
      //drops the mongo db
      db.dropDatabase("digital-dj");
      //seed the dev data
      await User.create(users);
      await Track.create(tracks);
      //sessions need an ownerID, will use mongo's ObjectID. we can seed that, user needs to be created first
      //get the user ids and add their owner IDs to the session owner property
      const user = await User.find();
      for (let i = 0; i < sessions.length; i++) {
        await Session.create({
          ...sessions[i],
          ownerID: user[i]._id,
        });
        //devlogging to make sure i had the info set up correctly
        dev.multiLog(
          false,
          "iteration:",
          i,
          "user:",
          user[i],
          "session:",
          sessions[i]
        );
      }
      const session = await Session.find();
      const track = await Track.find();
      //add 1 session to each of the 3 user's sessionList
      for (let j = 0; j < session.length; j++) {
        await User.findOneAndUpdate(
          {_id:user[j]._id},
          {$addToSet: {sessionList: session[j]._id}}
        );
        await Session.findOneAndUpdate(
          {_id:session[j]._id},
          {$addToSet: {que: track[j]}},
        );
        await Session.findOneAndUpdate(
          {_id:session[j]._id},
          {$addToSet: {history: track[j]._id}},
        );
        dev.multiLog(
          false,
          "iteration:",
          j,
          "user:",
          user[j],
          "session:",
          session[j],
          "track:",
          tracks[j]
        );
      }


      dev.log("Database dropped and reseeded with dev environment data", true);
      process.exit(0);
    }
  } catch (err) {
    //log any errors
    dev.groupError("seed", [err]);
    process.exit(1);
  }
});
