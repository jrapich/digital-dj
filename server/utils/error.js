const { GraphQLError } = require("graphql");
const { DevLoggingTools } = require("./dev");
const dev = new DevLoggingTools(false);

class GraphQLErrorData {
  constructor(option) {
    let query = false;
    let mutation = false;
    option === "query" ? query = true : null;
    option === "mutation" ? mutation  = true : null; 
    this.extensions = {
      code: null,
      reason: null,
      message: null,
      status: null,
      user: null,
      query: query,
      mutation: mutation,
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
  constructor(option, obj) {
    super();
    this.extensions = obj.extensions;
    this.extensions.code = "UNAUTHENTICATED";
    this.extensions.type = option;
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
    this.extensions.query = true;
    this.extensions.type = query;
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
    this.extensions.mutation = true;
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

class EmailError extends MutationError {
  constructor(mutation, obj, err) {
    super(mutation, obj);
    switch (err.type) {
      case "regexp":
        this.extensions.status = 400;
        this.extensions.reason = "email regexp";
        this.extensions.code = "Email Validation";
        this.extensions.message = "MongoDB Email Validation Error: email must be a valid email address";
        return new GraphQLError("Email Validation", {
          extensions: this.extensions,
        });
      default:
        break;
    }
  }
}

class PasswordError extends MutationError {
  constructor(mutation, obj, err) {
    super(mutation, obj);
    switch (err.type) {
      case "minlength":
        this.extensions.status = 400;
        this.extensions.reason = "minlength";
        this.extensions.code = "Password Length";
        this.extensions.message = "MongoDB Password Validation Error: password must be at least 8 characters long";
        return new GraphQLError("Password Length Validation", {
          extensions: this.extensions,
        });
        break;
      case "maxlength":
        this.extensions.status = 400;
        this.extensions.reason = "maxlength";
        this.extensions.code = "Password Length";
        this.extensions.message = "MongoDB Password Validation Error: password has exceeded character limit";
        return new GraphQLError("Password Length Validation", {
          extensions: this.extensions,
        });
        break;
      default:
        break;
    }
  }
}

const mongoErrorThrower = (mutation, obj, err) => {
  let value;
  if (err.code) {
    value = err.code;
  } else if (err.errors.password) {
    value = err.errors.password.properties.path;
  } else if (err.errors.email) {
    value = err.errors.email.properties.path;
  }
  switch (value) {
    case 11000:
      const key = err.keyValue.username || err.keyValue.email;
      throw new DuplicateKeyError(mutation, obj, err.code, key);
    case "password":
      throw new PasswordError(mutation, obj, err.errors.password.properties);
    case "email":
      throw new EmailError(mutation, obj, err.errors.email.properties);
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
