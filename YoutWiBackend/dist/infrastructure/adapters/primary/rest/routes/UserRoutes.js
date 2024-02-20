"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserController_1 = __importDefault(require("../UserController"));
const router = express_1.default.Router();
const controller = new UserController_1.default();
router.get("/users", controller.findAllUsers);
router.post('/users', controller.saveUser);
router.get('/users/:id', controller.findUserById);
router.get('/users/username/:username', controller.findUserByUsername);
exports.default = router;
