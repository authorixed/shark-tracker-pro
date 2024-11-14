const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Shark {
    id: ID!
    name: String!
    species: String!
    pingCount: Int!
    location: String!
    timestamp: String!
  }

  type User {
    id: ID!
    username: String!
    favorites: [String]
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    sharks: [Shark]
    shark(id: ID!): Shark
    currentUser: User
  }

  type Mutation {
    signup(username: String!, password: String!): AuthPayload
    login(username: String!, password: String!): AuthPayload
    addShark(name: String!, species: String!, pingCount: Int!, location: String!, timestamp: String!): Shark
    deleteShark(id: ID!): String
  }
`;

module.exports = typeDefs;