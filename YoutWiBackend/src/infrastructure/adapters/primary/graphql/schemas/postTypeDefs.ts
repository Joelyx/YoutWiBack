import gql from 'graphql-tag';

export const postTypeDefs = gql`
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
    createdAt: Date!
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