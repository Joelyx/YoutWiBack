import express from "express";
import {myContainer} from "../../../../config/inversify.config";
import {Types} from "../../../../config/Types";
import {verifyToken} from "../../../../../middleware/AuthMiddleware";
import PostController from "../PostController";


export default function configurePostRoutes() {
    const router = express.Router();
    const postController = myContainer.get<PostController>(Types.PostController);

    router.post('', verifyToken, postController.savePost);
    router.get('/me', verifyToken, postController.findPostsWithLimitAndOffset);
    router.get('/:postId/comments', verifyToken, postController.findPostComments);
    router.post('/:postId/comments', verifyToken, postController.savePostComment);
    router.post('/:postId/like', verifyToken, postController.likePost);
    router.get('/me', verifyToken, postController.findUserPosts);
    /*router.get('/:postId', verifyToken, postController.getPost);
    router.post('/liked', verifyToken, postController.saveLikedUserPosts);
    router.post('/comment', verifyToken, postController.saveComment);*/

    return router;
}