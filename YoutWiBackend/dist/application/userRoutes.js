"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = __importDefault(require("./userController"));
const router = express_1.default.Router();
const controller = new userController_1.default();
router.get("/users", controller.findAllUsers);
router.post('/users', controller.saveUser);
router.get('/users/:id', controller.findUserById);
router.get('/users/username/:username', controller.findUserByUsername);
exports.default = router;
