"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userTypeDefs = void 0;
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.userTypeDefs = (0, graphql_tag_1.default) `
  scalar Date

  type User {
    id: ID!
    googleId: String
    twitchId: String
    twitchToken: String
    username: String!
    password: String
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
