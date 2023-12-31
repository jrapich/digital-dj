const typeDefs = `
    type User {
        _id: ID
        username: String!
        email: String!
        password: String!
        partyList: [Party]
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

    type Party {
        _id: ID
        owner: String!
        ownerID: ID!
        isPublic: Boolean!
        partyName: String!
        passcode: String
        que: [Track]
        history: [Track]
    }

    input AddParty {
        userID: ID!
        isPublic: Boolean!
        partyName: String!
        passcode: String
    }

    type Query {
        me: User
        user(username: String!): User
        publicPartyList: [Party]
        trackQue(partyID: ID!): [Track]
        history(partyID: ID!): [Track]
    }

    type Mutation {
        addUser(username: String!, email: String!, password: String!): Auth
        login(email: String!, password: String!): Auth
        addParty(newParty: AddParty!): Party
        deleteParty(partyID: ID!): Party
        addTrack(trackData: AddTrack!): Party
        deleteTrack(trackID: ID!): Party
    }
`;

module.exports = typeDefs;
