//tools to help me debug/log different things when needed

class DevEnvironment {
  constructor() {
    this.isLogging = process.env.DEV_DEBUGGING === "true" ? true : false;
    this.isProduction = process.env.NODE_ENV === "true" ? true : false;
  }
}

class DevLoggingTools extends DevEnvironment {
  constructor(properties) {
    super(properties);
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

module.exports = { DevEnvironment, DevLoggingTools };
