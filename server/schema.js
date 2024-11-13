const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Shark {
        id: ID
        name: String
        species: String
        pingCount: Int
        location: String
        timestamp: String
    }

    type User {
        id: ID
        username: String
        favorites: [String]
    }

    type Query {
        sharks: [Shark]
        user(id: ID!): User
    }

    type Mutation {
        addShark(name: String, species: String, pingCount: Int, location: String): Shark
        addUser(username: String!, password: String!): User
        addFavorite(userId: ID!, location: String!): User
    }
`;

module.exports = typeDefs;