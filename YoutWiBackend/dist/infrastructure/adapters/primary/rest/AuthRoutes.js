"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/authRoutes.ts
const express_1 = __importDefault(require("express"));
const inversify_config_1 = require("../../../config/inversify.config");
const types_1 = require("../../../config/types");
const passport_1 = __importDefault(require("passport"));
function configureAuthRoutes() {
    const router = express_1.default.Router();
    const controller = inversify_config_1.myContainer.get(types_1.TYPES.AuthController);
    router.post('/register', (req, res) => controller.register(req, res));
    router.post('/login', (req, res) => controller.login(req, res));
    router.get('/confirm/:uid', (req, res) => controller.verifyAccount(req, res));
    router.post('/auth/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
    router.post('/auth/google/callback', passport_1.default.authenticate('google'), controller.googleAuthCallback);
    return router;
}
exports.default = configureAuthRoutes;
