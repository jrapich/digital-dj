const mongoose = require("mongoose");
const { DeployedEnvironment } = require("../utils/dev");
const deploy = new DeployedEnvironment();

mongoose.connect(deploy.mongodb);

module.exports = mongoose.connection;
