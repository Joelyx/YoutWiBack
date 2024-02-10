"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inversify_config_1 = require("../../../../config/inversify.config");
const types_1 = require("../../../../config/types");
const AuthMiddleware_1 = require("../../../../../middleware/AuthMiddleware");
function configureChannelRoutes() {
    const router = express_1.default.Router();
    const channelController = inversify_config_1.myContainer.get(types_1.TYPES.ChannelController);
    router.post('', AuthMiddleware_1.verifyToken, channelController.saveChannels);
    return router;
}
exports.default = configureChannelRoutes;
