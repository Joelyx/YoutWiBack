"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.typeDefs = (0, graphql_tag_1.default) `
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
