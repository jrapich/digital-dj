const { Schema, model } = require("mongoose");
const { Session } = require('./');
const bcrypt = require("bcrypt");
const { DevLoggingTools} = require('../utils');
const dev = new DevLoggingTools(false);

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, "Must have a valid email address!"],
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  sessionList: [
    {
      type: Schema.Types.ObjectId,
      ref: "session",
    },
  ],
  createdOn: {
    type: Date,
  },
  lastUpdated: {
    type: Date,
  },
});

userSchema.pre("save", async function (next) {
  (this.isNew || this.isModified("password")) 
    ? this.password = await bcrypt.hash(this.password, 15)
    : null;
  this.isNew
    ? ((this.createdOn = new Date()), (this.lastUpdated = new Date()))
    : (this.lastUpdated = new Date());
  next();
});

//TODO: add lots of error handling middleware https://mongoosejs.com/docs/middleware.html

userSchema.pre("findOneAndDelete", async function (next) {
  //middleware function to delete all the sessions the user owns first
  //TODO: test this
  const userToDelete = await this.model.findOne(this.getQuery());
  //some debug logging this middleware function for testing purposes
  //dev.groupTable('user/session list deletion middleware', [userToDelete, userToDelete.sessionList]);
  const deleteSession = await this.model.deleteMany(
    {_id: {$in: userToDelete.sessionList}}
  );
  dev.log(deleteSession);

  next();
});

userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.post("validate", function (document){
  dev.group("post user validate mongoose document:", [document]);
  dev.log(`mongoose: new/existing user validating`, true);
});

const User = model("user", userSchema);

module.exports = User;
