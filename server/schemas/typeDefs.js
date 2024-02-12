const typeDefs = `
    type User {
        _id: ID
        username: String!
        email: String
        password: String
        sessionList: [Session]
    }

    type Auth {
        token: String
        user: User
    }

    type Track {
        _id: ID
        artist: String
        title: String
        platform: String
        URL: String!
    }

    type Session {
        _id: ID
        owner: String!
        ownerID: ID!
        isPublic: Boolean!
        sessionName: String!
        passcode: String
        que: [Track]
        history: [Track]
    }
    type MutationResult {
        code: Int
        message: String
        user: String
        time: String
    }

    input AddTrack {
        artist: String
        title: String
        platform: String
        URL: String!
    }

    input AddSession {
        userID: ID!
        isPublic: Boolean!
        sessionName: String!
        passcode: String
    }

    type Query {
        me: User
        user(username: String!): User
        publicSessionList: [Session]
        trackQue(sessionID: ID!): [Track]
        history(sessionID: ID!): [Track]
    }

    type Mutation {
        addUser(username: String!, email: String!, password: String!): Auth
        deleteUser(email: String!, password: String!): Auth
        login(email: String!, password: String!): Auth
        addSession(newSession: AddSession!): Session
        deleteSession(SessionID: ID!): MutationResult
        addTrack(trackData: AddTrack!, SessionID: ID!): MutationResult
        deleteTrack(trackID: ID!, SessionID: ID!): MutationResult
    }
`;

module.exports = typeDefs;
