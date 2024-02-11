const { GraphQLError } = require("graphql");
const { DevLoggingTools } = require("./dev");
const dev = new DevLoggingTools(false);

class GraphQLErrorData {
  constructor() {
    this.extensions = {
      code: null,
      reason: null,
      message: null,
      status: null,
      user: null,
      query: null,
      mutation: null,
      type: null,
    };
  }
  get setReason() {
    return this.extensions.reason;
  }
  set setReason(reason) {
    this.extensions.reason = reason;
  }
  get errorMessage() {
    return this.extensions.message;
  }
  set errorMessage(message) {
    this.extensions.message = message;
  }
  get statusCode() {
    return this.extensions.status;
  }
  set statusCode(code) {
    this.extensions.status = code;
  }
  get username() {
    return this.extensions.user;
  }
  set username(user) {
    this.extensions.user = user;
  }
}

class AuthenticationError extends GraphQLErrorData {
  constructor(obj) {
    super();
    this.extensions = obj.extensions;
    this.extensions.code = "UNAUTHENTICATED";
    return new GraphQLError("Authentication Failure", {
      extensions: this.extensions,
    });
  }
}

class QueryError extends GraphQLErrorData {
  constructor(query, obj) {
    super();
    this.extensions = obj.extensions;
    this.extensions.code = "QUERY FAILED";
    this.extensions.query = query;
    this.extensions.type = "query";
    return new GraphQLError("Query Failure", {
      extensions: this.extensions,
    });
  }
}

class MutationError extends GraphQLErrorData {
  constructor(mutation, obj) {
    super();
    this.extensions = obj.extensions;
    this.extensions.code = "MUTATION FAILED";
    this.extensions.mutation = "mutation";
    this.extensions.type = mutation;
    return new GraphQLError("Mutation Failure", {
      extensions: this.extensions,
    });
  }
  
}

class DuplicateKeyError extends MutationError {
  constructor(mutation, obj, code, keyValue) {
    super(mutation, obj);
    this.extensions.status = code;
    this.extensions.reason = keyValue;
    this.extensions.code = "Duplicate Key";
    this.extensions.message =
      "MongoDB Duplicate Key Error: cannot create entry that is a duplicate of another";
    return new GraphQLError("Duplicate Key Error", {
      extensions: this.extensions,
    });
  }
}

const mongoErrorThrower = (err, obj, mutation) => {
  switch (err.code) {
    case 11000:
      const key = err.keyValue.username || err.keyValue.email;
      throw new DuplicateKeyError(mutation, obj, err.code, key);
      break;
    default:
      dev.log(`no valid mongo error case detected for ${mutation}`);
      break;
  }
}

module.exports = {
  GraphQLErrorData,
  AuthenticationError,
  QueryError,
  MutationError,
  DuplicateKeyError,
  mongoErrorThrower,
};
