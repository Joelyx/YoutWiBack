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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inversify_config_1 = require("../../../../config/inversify.config");
const Types_1 = require("../../../../config/Types");
const passport_1 = __importDefault(require("passport"));
function configureAuthRoutes() {
    const router = express_1.default.Router();
    const controller = inversify_config_1.myContainer.get(Types_1.Types.AuthController);
    router.post('/register', (req, res) => controller.register(req, res));
    router.post('/login', (req, res) => controller.login(req, res));
    router.get('/confirm/:uid', (req, res) => controller.verifyAccount(req, res));
    router.get('/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
    router.get('/google/callback', passport_1.default.authenticate('google'), (req, res) => {
        // Redirige al usuario o maneja la sesión como necesites
        res.redirect('/');
    });
    router.post('/google', (req, res) => __awaiter(this, void 0, void 0, function* () { return controller.googleAuth(req, res); }));
    router.get('/twitch/callback', (req, res) => __awaiter(this, void 0, void 0, function* () { return controller.twitchAuth(req, res); }));
    return router;
}
exports.default = configureAuthRoutes;
