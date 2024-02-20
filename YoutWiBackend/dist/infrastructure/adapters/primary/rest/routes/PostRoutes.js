"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inversify_config_1 = require("../../../../config/inversify.config");
const AuthMiddleware_1 = require("../../../../../middleware/AuthMiddleware");
const Types_1 = require("../../../../config/Types");
function configurePostRoutes() {
    const router = express_1.default.Router();
    const postController = inversify_config_1.myContainer.get(Types_1.Types.PostController);
    router.get("", AuthMiddleware_1.verifyToken, postController.findPostsWithLimitAndOffset);
    router.get("/:postId", AuthMiddleware_1.verifyToken, postController.findPost);
    router.get("/:postId/comments", AuthMiddleware_1.verifyToken, postController.findPostComments);
    router.post("", AuthMiddleware_1.verifyToken, postController.savePost);
    return router;
}
exports.default = configurePostRoutes;
