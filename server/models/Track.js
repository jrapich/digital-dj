const { Schema, model } = require("mongoose");

const trackSchema = new Schema({
  artist: {
    type: String,
    trim: true,
  },
  title: {
    type: String,
    trim: true,
  },
  platform: {
    type: String,
    trim: true,
  },
  URL: {
    type: String,
    required: true,
  },
  createdOn: {
    type: Date,
  },
  lastUpdated: {
    type: Date,
  },
});

trackSchema.pre("save", async function (next) {
  this.isNew
    ? ((this.createdOn = new Date()), (this.lastUpdated = new Date()))
    : (this.lastUpdated = new Date());
  next();
});

//TODO: add lots of error handling middleware https://mongoosejs.com/docs/middleware.html

const Track = model("track", trackSchema);

module.exports = Track;
