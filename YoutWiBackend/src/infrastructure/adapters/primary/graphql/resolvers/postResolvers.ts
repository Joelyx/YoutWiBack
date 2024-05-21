import { IResolvers } from '@graphql-tools/utils';
import {PostDomainService} from "../../../../../domain/services/PostDomainService";
import {Post} from "../../../../../domain/models/Post";
import {Comment} from "../../../../../domain/models/Comment";
import {myContainer} from "../../../../config/inversify.config";
import {IPostDomainService} from "../../../../../domain/port/primary/IPostDomainService";
import {Types} from "../../../../config/Types";

const postDomainService = myContainer.get<IPostDomainService>(Types.IPostDomainService);

const postResolvers = {
    Query: {
        getPost: async (_: any, { id }: { id: string }) => {
            return postDomainService.findPost(id);
        },
        getAllPosts: async (_: any, { limit = 10, offset = 0 }: { limit: number; offset: number }) => {
            return postDomainService.findPostsWithLimitAndOffset(limit, offset);
        },
        getUserPosts: async (_: any, { userId }: { userId: string }) => {
            return postDomainService.findUserPosts(userId);
        },
    },
    Mutation: {
        createPost: async (_: any, { content, userId, videoId }: { content: string; userId: string; videoId: string; }) => {
            // Suponiendo la existencia de un método de constructor o una función fábrica para Post
            const newPost = new Post(/* parámetros para inicializar el post */);
            // Lógica para asignar valores a newPost basado en content, userId, videoId
            await postDomainService.savePost(newPost);
            return newPost;
        },
       /* updatePost: async (_: any, { id, content, likes }: { id: string; content?: string; likes?: number }, { postDomainService }) => {
            // Lógica similar para actualizar un post existente
        },
        addCommentToPost: async (_: any, { postId, comment }: { postId: string; comment: Comment }, { postDomainService }) => {
            // Lógica para añadir comentario
        },
        likePost: async (_: any, { postId, userId }: { postId: string; userId: string }, { postDomainService }) => {
            // Lógica para manejar like en un post
        },*/
    },
    Post: {
        comments: async (post: any, _args: any): Promise<Comment[]> => {
            return postDomainService.findPostComments(post.id);
        },
        // Más resolvers para campos si son necesarios...
    },
    // Quizás necesites definir más resolvers para otros tipos como Comment, User, Video, etc.
};

export default postResolvers;