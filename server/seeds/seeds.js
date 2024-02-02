const db = require('../config/connection');
const {DevLoggingTools} = require('../utils/dev');
const dev = new DevLoggingTools(true);
const {User, Track, Session} = require('../models');

const users = require('./userSeeds.json');
const tracks = require('./trackSeeds.json');
const sessions = require('./sessionSeeds.json');

db.once('open', async () => {
    try {
        //only in dev environment for testing purposes
        if (!dev.isProduction) {
            //drops the mongo db
            db.dropDatabase('digital-dj');
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
                dev.multiLog(false, 'iteration:', i, 'user:', user[i], 'session:', sessions[i]);
            }
            dev.log('Database dropped and reseeded with dev environment data', true);
            process.exit(0);
        }
    } catch (err) {
        dev.groupError('seed', [err]);
        process.exit(1);
    }
});