import gql from 'graphql-tag';

export const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String
    # Añade más campos según sea necesario
  }

  # Queries
  type Query {
    getUser(id: ID!): User
    getAllUsers: [User]
  }

  # Mutations
  type Mutation {
    createUser(username: String!, email: String): User
    updateUser(id: ID!, username: String, email: String): User
    deleteUser(id: ID!): ID
  }
`;