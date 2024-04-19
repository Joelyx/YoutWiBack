import gql from 'graphql-tag';

export const userTypeDefs = gql`
  scalar Date

  type User {
    id: ID!
    username: String!
    uid: String!
    active: Boolean!
    role: String
    friends: [ID!]
    email: String
    createdAt: Date
    updatedAt: Date
    deletedAt: Date
  }

  # Queries
  type Query {
    getUser(id: ID!): User
    getAllUsers: [User]
    getFriends(userId: ID!): [User]
  }

  # Mutations
  type Mutation {
    createUser(username: String!, email: String, password: String, role: String): User
    updateUser(id: ID!, username: String, email: String, role: String): User
    deleteUser(id: ID!): ID
    addFriend(userId: ID!, friendId: ID!): User
    removeFriend(userId: ID!, friendId: ID!): User
  }
`;