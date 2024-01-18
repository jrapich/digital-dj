const typeDefs = `
    type User {
        _id: ID
        username: String!
        email: String!
        password: String!
        sessionList: [Session]
    }

    type Auth {
        token: ID!
        user: User
    }

    type Track {
        _id: ID
        artist: String
        title: String
        platform: String
        URL: String!
    }

    input AddTrack {
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
        trackQue(SessionID: ID!): [Track]
        history(SessionID: ID!): [Track]
    }

    type Mutation {
        addUser(username: String!, email: String!, password: String!): Auth
        login(email: String!, password: String!): Auth
        addSession(newSession: AddSession!): Session
        deleteSession(SessionID: ID!): Session
        addTrack(trackData: AddTrack!): Session
        deleteTrack(trackID: ID!): Session
    }
`;

module.exports = typeDefs;
