import express from "express";
import {myContainer} from "../../../../config/inversify.config";
import PostController from "../PostController";
import {verifyToken} from "../../../../../middleware/AuthMiddleware";
import {Types} from "../../../../config/Types";


export default function configurePostRoutes() {
    const router = express.Router();
    const postController = myContainer.get<PostController>(Types.PostController);

    router.get("", verifyToken, postController.findPostsWithLimitAndOffset);
    router.get("/:postId", verifyToken, postController.findPost);
    router.get("/:postId/comments", verifyToken, postController.findPostComments);
    router.post("", verifyToken, postController.savePost);
    return router
}