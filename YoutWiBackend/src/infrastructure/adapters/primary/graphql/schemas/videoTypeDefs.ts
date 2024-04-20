import gql from 'graphql-tag';

export const videoTypeDefs = gql`
  scalar Date

  type Video {
    id: ID!
    title: String!
    createdAt: Date!
  }

  type Query {
    getAllVideos(limit: Int, offset: Int): [Video!]!
    getVideo(id: ID!): Video
  }

  type Mutation {
    createVideo(title: String!, id: String!): Video
  }
`;
