const { Schema, model } = require("mongoose");

const userSchema = new Schema({
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
});

const Track = model("track", userSchema);

module.exports = Track;
