//tools to help me debug/log different things when needed

const dotenv = require('dotenv').config();

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
  selfLog(logSelf) {
    if (logSelf) {
      console.log('debug logging is enabled:', this.isLogging);
      console.log('node env is production:', this.isProduction);
    }
  }
  log(content) {
    if (this.isLogging) {
      console.log(content);
    }
    return;
  }
  table(tableObject) {
    if (this.isLogging) {
      console.table(tableObject);
    }
    return;
  }
  group(groupedLogsName, groupedLogsArray) {
    if (this.isLogging) {
      console.group(groupedLogsName);
      for (let i = 0; i < groupedLogsArray.length; i++) {
        console.log(groupedLogsArray[i]);
      }
      console.groupEnd();
    }
    return;
  }
  collapsedGroup(groupedLogsName, groupedLogsArray) {
    if (this.isLogging) {
      console.groupCollapsed(groupedLogsName);
      for (let i = 0; i < groupedLogsArray.length; i++) {
        console.log(groupedLogsArray[i]);
      }
      console.groupEnd();
    }
    return;
  }
  info(info) {
    if (this.isLogging) {
      console.info(info);
    }
    return;
  }
  warn(warn) {
    if (this.isLogging) {
      console.warn(warn);
    }
    return;
  }
  error(error) {
    if (this.isLogging) {
      console.error(error);
    }
    return;
  }
  trace(trace) {
    if (this.isLogging) {
      //we could easily add more logic here for better tracing
      console.trace(trace);
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
