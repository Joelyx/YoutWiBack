"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inversify_config_1 = require("../../../../config/inversify.config");
const Types_1 = require("../../../../config/Types");
const AuthMiddleware_1 = require("../../../../../middleware/AuthMiddleware");
function configureSupportMessageRoutes() {
    const router = express_1.default.Router();
    const supportMessageController = inversify_config_1.myContainer.get(Types_1.Types.SupportMessageController);
    //router.post('', verifyToken, supportMessageController.saveSupportMessage);
    //router.get('', verifyToken, supportMessageController.findSupportMessages);
    router.get('/me', AuthMiddleware_1.verifyToken, supportMessageController.findUserSupportMessages);
    //router.get('/:id', verifyToken, supportMessageController.findSupportMessageById);
    return router;
}
exports.default = configureSupportMessageRoutes;
