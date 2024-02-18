"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AuthMiddleware_1 = require("../../../../../middleware/AuthMiddleware");
const inversify_config_1 = require("../../../../config/inversify.config");
const express_1 = __importDefault(require("express"));
const Types_1 = require("../../../../config/Types");
function configureBroadcasterRoutes() {
    const router = express_1.default.Router();
    const broadcasterController = inversify_config_1.myContainer.get(Types_1.Types.BroadcasterController);
    router.post('/followed', AuthMiddleware_1.verifyToken, broadcasterController.saveFollowed);
    router.post('', AuthMiddleware_1.verifyToken, broadcasterController.saveBroadcasters);
    router.get('/me', AuthMiddleware_1.verifyToken, broadcasterController.findUserFollowedBroadcasters);
    return router;
}
exports.default = configureBroadcasterRoutes;
