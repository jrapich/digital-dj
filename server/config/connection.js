const mongoose = require("mongoose");
const { DeployedEnvironment } = require("../utils");
const deploy = new DeployedEnvironment("digital-dj");

mongoose.connect(deploy.mongodb);

module.exports = mongoose.connection;
