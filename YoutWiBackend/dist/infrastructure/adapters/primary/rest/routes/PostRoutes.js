"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inversify_config_1 = require("../../../../config/inversify.config");
const Types_1 = require("../../../../config/Types");
const AuthMiddleware_1 = require("../../../../../middleware/AuthMiddleware");
function configurePostRoutes() {
    const router = express_1.default.Router();
    const postController = inversify_config_1.myContainer.get(Types_1.Types.PostController);
    router.post('', AuthMiddleware_1.verifyToken, postController.savePost);
    router.get('/me', AuthMiddleware_1.verifyToken, postController.findPostsWithLimitAndOffset);
    router.get('/:postId/comments', AuthMiddleware_1.verifyToken, postController.findPostComments);
    router.post('/:postId/comments', AuthMiddleware_1.verifyToken, postController.savePostComment);
    router.post('/:postId/like', AuthMiddleware_1.verifyToken, postController.likePost);
    router.get('/me', AuthMiddleware_1.verifyToken, postController.findUserPosts);
    /*router.get('/:postId', verifyToken, postController.getPost);
    router.post('/liked', verifyToken, postController.saveLikedUserPosts);
    router.post('/comment', verifyToken, postController.saveComment);*/
    return router;
}
exports.default = configurePostRoutes;
