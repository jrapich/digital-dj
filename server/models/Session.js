const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const {DevLoggingTools} = require('../utils');
const dev = new DevLoggingTools(false);

const sessionSchema = new Schema({
  owner: {
    type: String,
    required: true,
  },
  ownerID: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  isPublic: {
    type: Boolean,
    required: true,
  },
  sessionName: {
    type: String,
    required: true,
  },
  passcode: {
    type: String,
    minlength: 3,
    maxlength: 6,
  },
  que: [
    {
      type: Schema.Types.ObjectId,
      ref: "track",
    },
  ],
  history: [
    {
      type: Schema.Types.ObjectId,
      ref: "track",
    },
  ],
  createdOn: {
    type: Date,
  },
  lastUpdated: {
    type: Date,
  },
});

sessionSchema.pre("save", async function (next) {
  this.isNew
    ? ((this.createdOn = new Date()), (this.lastUpdated = new Date()))
    : (this.lastUpdated = new Date());
  if (this.passcode) {
    this.isNew || this.isModified("passcode")
      ? (this.passcode = await bcrypt.hash(this.passcode, 10))
      : next();
    //below converted to ternary operator above
    // if (this.isNew || this.isModified("passcode")) {
    //   const saltRounds = 10;
    //   this.passcode = await bcrypt.hash(this.passcode, saltRounds);
    // }
  }
  next();
});

sessionSchema.pre("findOneAndDelete", async function (next) {
  //middleware function to delete all the tracks in que/history first
  //TODO: test this
  const sessionToDelete = await this.model.findOneAndUpdate(
    this.getQuery(),
    { $pull: { que: { $in: this.session.que } } },
    { $pull: { history: { $in: this.session.history } } },
    { new: true }
  );
  //some debug logging this middleware function for testing purposes
  dev.groupTable('session/track deletion middleware:', [sessionToDelete]);
  next();
});

//TODO: add lots of error handling middleware https://mongoosejs.com/docs/middleware.html

sessionSchema.methods.isCorrectPassword = async function (passcode) {
  return bcrypt.compare(passcode, this.passcode);
};

sessionSchema.post("deleteMany", function (res) {
  dev.log(`mongoose: user ${res.getQuery()} sessions deleted successfully`, true);
  dev.group("session post hook after deleteMany:", [res.getQuery(), res]);
});

const Session = model("session", sessionSchema);

module.exports = Session;
