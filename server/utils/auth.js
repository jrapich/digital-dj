const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");

const { DevEnvironment, DevLoggingTools } = require("./dev");
const prod = new DevEnvironment();
const dev = new DevLoggingTools(false);

const secret = process.env.JWT_SECRET;
const expiration = "48h";

module.exports = {
  AuthenticationError: new GraphQLError("Could not authenticate user.", {
    extensions: {
      code: "UNAUTHENTICATED",
    },
  }),
  authMiddleware: function ({ req }) {
    let token = req.body.token || req.query.token || req.headers.authorization;

    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }

    if (!token) {
      dev.warn('JWT token not found or is invalid! req token info follows:');
      dev.group('token data in this request:', [req.body.token, req.query.token, req.headers.authorization]);
      return req;
    }

    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch(e) {
      console.log("Invalid token");
      dev.log("error and invalid token data as follows:");
      dev.error(e);
      dev.log(token);
    }

    return req;
  },
  signToken: function ({ email, username, _id }) {
    const payload = { email, username, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
