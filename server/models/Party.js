const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema({
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
  partyName: {
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
});

userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("passcode")) {
    const saltRounds = 10;
    this.passcode = await bcrypt.hash(this.passcode, saltRounds);
  }

  next();
});

userSchema.methods.isCorrectPassword = async function (passcode) {
  return bcrypt.compare(passcode, this.passcode);
};

const Party = model("party", userSchema);

module.exports = Party;
