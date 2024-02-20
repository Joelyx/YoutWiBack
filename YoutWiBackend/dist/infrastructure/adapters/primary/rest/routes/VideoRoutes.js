"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthMiddleware_1 = require("../../../../../middleware/AuthMiddleware");
const inversify_config_1 = require("../../../../config/inversify.config");
const Types_1 = require("../../../../config/Types");
function configureVideoRoutes() {
    const router = express_1.default.Router();
    const videosController = inversify_config_1.myContainer.get(Types_1.Types.VideoController);
    router.post('/liked', AuthMiddleware_1.verifyToken, videosController.saveLikedUserVideos);
    router.post('', AuthMiddleware_1.verifyToken, videosController.saveVideos);
    router.get('/me', AuthMiddleware_1.verifyToken, videosController.findVideosForUser);
    router.get('/:videoId', AuthMiddleware_1.verifyToken, videosController.getVideo);
    return router;
}
exports.default = configureVideoRoutes;
