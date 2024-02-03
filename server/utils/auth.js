const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");

const { DevLoggingTools } = require("./dev");
const dev = new DevLoggingTools(false);

const secret = process.env.JWT_SECRET;
const expiration = process.env.TOKEN_EXPIRATION;

class AuthTools {
  constructor(compare) {
    this.compare = compare;
  }
  get authCompare() {
    return this.compare;
  }
  set authCompare(compare) {
    this.compare = compare;
  }
  AuthenticationError() {
    return new GraphQLError("Could not authenticate user.", {
      extensions: {
        code: "UNAUTHENTICATED",
      },
      reason: this.compare,
    });
  }
  middleware({ req }) {
    let token = req.body.token || req.query.token || req.headers.authorization;

    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }

    if (!token) {
      dev.warn("JWT token not found or is invalid! req token info follows:");
      dev.groupError("token", [
        this.req.body.token,
        this.req.query.token,
        this.req.headers.authorization,
      ]);
      return req;
    }

    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      this.req.user = data;
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
}

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
