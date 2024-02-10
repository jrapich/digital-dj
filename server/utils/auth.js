const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");

const { DevLoggingTools } = require("./dev");
const dev = new DevLoggingTools(false);

const secret = process.env.JWT_SECRET;
const expiration = process.env.TOKEN_EXPIRATION;
const devEmail = process.env.DEV_EMAIL

class AuthTools {
  constructor(compare, message) {
    this.compare = compare;
    this.message = message;
  }
  get comparison() {
    return this.compare;
  }
  set comparison(compare) {
    this.compare = compare;
  }
  get errorMessage() {
    return this.message;
  }
  set errorMessage(message) {
    this.message = message;
  }
  AuthenticationError() {
    return new GraphQLError("Could not authenticate user.", {
      extensions: {
        code: "UNAUTHENTICATED",
      },
      reason: this.compare,
      message: this.message,
    });
  }
  middleware({ req }) {
    let token = req.body.token || req.query.token || req.headers.authorization;
    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }

    if (!dev.isProduction && !token) {
      dev.log("no jwt token found, if token errors are appearing while using Apollo Graphql Server, add this authorization key to connection headers:");
      dev.log(devToken);
    }

    if (!token) {
      dev.warn("JWT token not found or is invalid! req token info follows:");
      dev.groupError("token", [
        req.body.token,
        req.query.token,
        req.headers.authorization,
      ]);
      return req;
    }

    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch (e) {
      dev.error(e);
      dev.warn("invalid token data as follows:");
      dev.log(token);
    }
    return req;
  }
  signToken({ email, username, _id }) {
    const payload = { email, username, _id };
    dev.table(payload);
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  }
  signDevToken(email) {
    if (!dev.isProduction) {
      const token = jwt.sign({ data: email }, secret);
      return token;
    }
    return;
  }
}

const devAuth = new AuthTools();
const devToken = devAuth.signDevToken(devEmail);

module.exports = {
  AuthTools,
  //below is what is translated to the OOP above

  // AuthenticationError: new GraphQLError("Could not authenticate user.", {
  //   extensions: {
  //     code: "UNAUTHENTICATED",
  //   },
  // }),
  // UserAuthenticationError: new GraphQLError("Could not authenticate user.", {
  //   extensions: {
  //     code: "UNAUTHENTICATED",
  //   },
  //   reason: "username",
  // }),
  // EmailAuthenticationError: new GraphQLError("Could not authenticate user.", {
  //   extensions: {
  //     code: "UNAUTHENTICATED",
  //     reason: "email",
  //   },
  // }),
  // PasswordAuthenticationError: new GraphQLError(
  //   "Could not authenticate user.",
  //   {
  //     extensions: {
  //       code: "UNAUTHENTICATED",
  //       reason: "password",
  //     },
  //   }
  // ),
  // authMiddleware: function ({ req }) {
  //   let token = req.body.token || req.query.token || req.headers.authorization;

  //   if (req.headers.authorization) {
  //     token = token.split(" ").pop().trim();
  //   }

  //   if (!token) {
  //     dev.warn("JWT token not found or is invalid! req token info follows:");
  //     dev.groupError("token", [
  //       req.body.token,
  //       req.query.token,
  //       req.headers.authorization,
  //     ]);
  //     return req;
  //   }

  //   try {
  //     const { data } = jwt.verify(token, secret, { maxAge: expiration });
  //     req.user = data;
  //   } catch (e) {
  //     dev.log("error and invalid token data as follows:");
  //     dev.error(e);
  //     dev.log(token);
  //   }

  //   return req;
  // },
  // signToken: function ({ email, username, _id }) {
  //   const payload = { email, username, _id };
  //   dev.table(payload);
  //   return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  // },
};
