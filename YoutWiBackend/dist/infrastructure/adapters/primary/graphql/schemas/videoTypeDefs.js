"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoTypeDefs = void 0;
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.videoTypeDefs = (0, graphql_tag_1.default) `
  scalar Date

  type Video {
    id: ID!
    title: String!
    createdAt: Date!
  }

  type Query {
    getAllVideos: [Video!]!
    getVideo(id: ID!): Video
  }

  type Mutation {
    createVideo(title: String!, id: String!): Video
  }
`;
