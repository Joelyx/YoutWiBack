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
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_config_1 = require("../../../config/inversify.config");
const Types_1 = require("../../../config/Types");
const User_1 = require("../../../../domain/models/User");
class UserController {
    constructor() {
        this.userDomainService = inversify_config_1.myContainer.get(Types_1.Types.IUserDomainService);
        this.saveUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let date = new Date();
                let u = new User_1.User();
                u.setUsername = req.body.username;
                u.setPassword = req.body.password;
                u.setRole = req.body.role;
                u.setFriends = new Set(req.body.friends);
                u.setEmail = req.body.email;
                u.setCreatedAt = new Date();
                u.setUpdatedAt = new Date();
                const user = yield this.userDomainService.save(u);
                res.status(201).json(user);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
        this.findAllUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.userDomainService.findAll();
                res.status(200).json(users);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
        this.findUserById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userDomainService.findById(Number(req.params.id));
                res.status(200).json(user);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
        this.findUserByUsername = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userDomainService.findByUsername(req.params.username);
                return res.status(200).json(user);
            }
            catch (error) {
                return res.status(500).json({ error: error.message });
            }
        });
    }
}
exports.default = UserController;
