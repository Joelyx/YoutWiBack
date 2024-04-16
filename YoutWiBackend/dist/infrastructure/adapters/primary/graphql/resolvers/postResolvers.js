"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Post_1 = require("../../../../../domain/models/Post");
const postResolvers = {
    Query: {
        getPost: (_1, _a, _b) => __awaiter(void 0, [_1, _a, _b], void 0, function* (_, { id }, { postDomainService }) {
            return postDomainService.findPost(id);
        }),
        getAllPosts: (_2, _c, _d) => __awaiter(void 0, [_2, _c, _d], void 0, function* (_, { limit = 10, offset = 0 }, { postDomainService }) {
            return postDomainService.findPostsWithLimitAndOffset(limit, offset);
        }),
        getUserPosts: (_3, _e, _f) => __awaiter(void 0, [_3, _e, _f], void 0, function* (_, { userId }, { postDomainService }) {
            return postDomainService.findUserPosts(userId);
        }),
    },
    Mutation: {
        createPost: (_4, _g, _h) => __awaiter(void 0, [_4, _g, _h], void 0, function* (_, { content, userId, videoId }, { postDomainService }) {
            // Suponiendo la existencia de un método de constructor o una función fábrica para Post
            const newPost = new Post_1.Post( /* parámetros para inicializar el post */);
            // Lógica para asignar valores a newPost basado en content, userId, videoId
            yield postDomainService.savePost(newPost);
            return newPost;
        }),
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
        comments: (post_1, _args_1, _j) => __awaiter(void 0, [post_1, _args_1, _j], void 0, function* (post, _args, { postDomainService }) {
            return postDomainService.findPostComments(post.id);
        }),
        // Más resolvers para campos si son necesarios...
    },
    // Quizás necesites definir más resolvers para otros tipos como Comment, User, Video, etc.
};
exports.default = postResolvers;
