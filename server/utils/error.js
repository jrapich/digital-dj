const { GraphQLError } = require("graphql");
const { DevLoggingTools } = require("./dev");
const dev = new DevLoggingTools(false);

class GraphQLErrorData {
  constructor(code) {
    this.code;
    this.reason;
    this.message;
    this.status;
    this.user;
    this.extensions = {
      code: this.code,
      reason: this.reason,
      message: this.message,
      status: this.status,
      user: this.username,
    };
  }
  get setReason() {
    return this.reason;
  }
  set setReason(reason) {
    this.reason = reason;
  }
  get errorMessage() {
    return this.message;
  }
  set errorMessage(message) {
    this.message = message;
  }
  get statusCode() {
    return this.status;
  }
  set statusCode(code) {
    this.status = code;
  }
  get username() {
    return this.user;
  }
  set username(user) {
    this.user = user;
  }
}

class AuthenticationError extends GraphQLErrorData {
  constructor() {
    super();
    this.code = "UNAUTHENTICATED";
    return new GraphQLError("Authentication Failure", {
      extensions: this.extensions,
    });
  }
}

class QueryError extends GraphQLErrorData {
  constructor(query) {
    super();
    this.code = "QUERY FAILED";
    this.query = "query";
    this.type = query;
    this.expirations.query = this.query;
    this.extensions.type = this.type;
    return new GraphQLError("Query Failure", {
      extensions: this.extensions,
    });
  }
}

class MutationError extends GraphQLErrorData {
  constructor(mutation) {
    super();
    this.code = "MUTATION FAILED";
    this.query = "mutation";
    this.type = mutation;
    this.extensions.mutation = this.mutation;
    this.extensions.type = this.type;
    return new GraphQLError("Mutation Failure", {
      extensions: this.extensions,
    });
  }
}



module.exports = {
    AuthenticationError, QueryError, MutationError,
}