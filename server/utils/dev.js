//tools to help me debug/log different things when needed

const dotenv = require("dotenv").config();

class DevEnvironment {
  constructor() {
    this.isLogging = process.env.DEV_DEBUGGING === "true" ? true : false;
    this.isProduction = process.env.NODE_ENV === "production" ? true : false;
  }
}

class DeployedEnvironment extends DevEnvironment {
  constructor(mongodbName, sqlName) {
    super();
    this.mongodb = process.env.MONGODB_URI || `mongodb://127.0.0.1:27017/${mongodbName}`;
  }
}

class DevLoggingTools extends DevEnvironment {
  constructor(logSelf) {
    super();
    dotenv.error ? console.error(dotenv.error) : null;
    this.selfLog(logSelf);
  }
  break() {
    console.log("");
  }
  selfLog(logSelf) {
    if (logSelf) {
      this.break();
      console.log("debug logging is enabled:", this.isLogging);
      console.log("node env is production:", this.isProduction);
      this.break();
    }
  }
  log(content) {
    if (this.isLogging) {
      this.break();
      console.log(content);
      this.break();
    }
    return;
  }
  table(tableObject) {
    if (this.isLogging) {
      this.break();
      console.table(tableObject);
      this.break();
    }
    return;
  }
  group(groupedLogsName, groupedLogsArray) {
    if (this.isLogging) {
      this.break();
      console.group(groupedLogsName);
      this.break();
      for (let i = 0; i < groupedLogsArray.length; i++) {
        console.log(groupedLogsArray[i]);
        this.break();
      }
      console.groupEnd();
      this.break();
    }
    return;
  }
  groupError(groupedLogsName, groupedLogsArray) {
    if (this.isLogging) {
      this.break();
      console.group(`${groupedLogsName} errors are as follows:`);
      this.break();
      for (let i = 0; i < groupedLogsArray.length; i++) {
        console.log(groupedLogsArray[i]);
        this.break();
      }
      console.groupEnd();
      console.log(`end of ${groupedLogsName} errors.`);
      this.break();
    }
    return;
  }
  collapsedGroup(groupedLogsName, groupedLogsArray) {
    if (this.isLogging) {
      this.break();
      console.groupCollapsed(groupedLogsName);
      this.break();
      for (let i = 0; i < groupedLogsArray.length; i++) {
        console.log(groupedLogsArray[i]);
        this.break();
      }
      console.groupEnd();
      this.break();
    }
    return;
  }
  collapsedGroupError(groupedLogsName, groupedLogsArray) {
    if (this.isLogging) {
      this.break();
      console.groupCollapsed(`${groupedLogsName} errors are as follows:`);
      this.break();
      for (let i = 0; i < groupedLogsArray.length; i++) {
        console.log(groupedLogsArray[i]);
        this.break();
      }
      console.groupEnd();
      console.log(`end of ${groupedLogsName} errors.`);
      this.break();
    }
    return;
  }
  info(info) {
    if (this.isLogging) {
      this.break();
      console.info(info);
      this.break();
    }
    return;
  }
  warn(warn) {
    if (this.isLogging) {
      this.break();
      console.warn(warn);
      this.break();
    }
    return;
  }
  error(error) {
    if (this.isLogging) {
      this.break();
      console.error(error);
      this.break();
    }
    return;
  }
  trace(trace) {
    if (this.isLogging) {
      //we could easily add more logic here for better tracing
      this.break();
      console.trace(trace);
      this.break();
    }
    return;
  }
  clear() {
    if (this.isLogging) {
      console.clear();
    }
    return;
  }
}

module.exports = { DevEnvironment, DeployedEnvironment, DevLoggingTools };
