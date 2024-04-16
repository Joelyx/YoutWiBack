"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postTypeDefs = void 0;
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.postTypeDefs = (0, graphql_tag_1.default) `
  scalar Date

  type Post {
    id: ID!
    content: String!
    likes: Int
    comments: [Comment!]!
    user: User!
    video: Video!
    createdAt: Date!
    updatedAt: Date
    deletedAt: Date
  }

  type Comment {
    id: ID!
    content: String!
    user: User!
    post: Post!
    createdAt: Date!
    updatedAt: Date
    deletedAt: Date
  }

  type User {
    id: ID!
    username: String!
    # Asumiendo que ya tienes un modelo para User
    # y un schema definido en otro lugar
  }

  type Video {
    id: ID!
    title: String!
    url: String!
    # Asumiendo que ya tienes un modelo para Video
    # y un schema definido en otro lugar
  }

  # Raíz para consultas GraphQL
  type Query {
    getPost(id: ID!): Post
    getAllPosts(limit: Int, offset: Int): [Post!]!
    getUserPosts(userId: ID!): [Post!]!
  }

  # Raíz para mutaciones GraphQL
  type Mutation {
    createPost(content: String!, userId: ID!, videoId: ID!): Post
    # Considerando que añadirás las mutaciones comentadas más tarde
    # updatePost(id: ID!, content: String, likes: Int): Post
    # addCommentToPost(postId: ID!, content: String!, userId: ID!): Comment
    # likePost(postId: ID!, userId: ID!): Post
  }
`;
