"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
const inversify_1 = require("inversify");
const Types_1 = require("../../../config/Types");
const node_path_1 = __importDefault(require("node:path"));
const fs_1 = __importDefault(require("fs"));
let UserV2Controller = class UserV2Controller {
    constructor(userService) {
        this.userService = userService;
        this.uploadUserImage = (req, res) => __awaiter(this, void 0, void 0, function* () {
            if (!req.file) {
                res.status(400).json({ message: "No file uploaded" });
                return;
            }
            res.status(200).json({ message: "Image uploaded successfully", path: req.file.path });
        });
        this.changeUsername = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.user.id; // Asumiendo que el id del usuario está en el token
            const { newUsername } = req.body;
            const user = yield this.userService.findById(userId);
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            const usernameExists = yield this.userService.findByUsername(newUsername);
            if (usernameExists) {
                res.status(409).json({ message: "Username already exists" });
                return;
            }
            user.setUsername = newUsername;
            try {
                yield this.userService.save(user);
                res.status(200).json({ message: "Username updated successfully" });
            }
            catch (error) {
                res.status(500).json({ message: "Could not update username", error: error.toString() });
            }
        });
        this.getUserImage = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.userId;
            const imageName = `${userId}.jpg`;
            const imagePath = node_path_1.default.resolve(__dirname, '..', '..', '..', '..', 'public', 'images', imageName);
            if (fs_1.default.existsSync(imagePath)) {
                res.sendFile(imagePath);
            }
            else {
                res.status(404).send("Image not found.");
            }
        });
        this.findOtherUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { startswith } = req.query;
            const reqUserId = req.user.userId;
            try {
                const reqUser = yield this.userService.findById(reqUserId);
                if (!reqUser) {
                    res.status(404).json({ message: "User not found" });
                    return;
                }
                const users = yield this.userService.findStartsWithUsername(startswith);
                const usersDtoPromise = users.map((user) => __awaiter(this, void 0, void 0, function* () {
                    const isFollowing = yield this.userService.checkIfFollowsUser(reqUser, user);
                    return {
                        id: user.getId,
                        username: user.getUsername,
                        isFollowing
                    };
                }));
                const usersDto = yield Promise.all(usersDtoPromise);
                res.status(200).json(usersDto);
            }
            catch (error) {
                console.error('Error fetching users:', error);
                res.status(500).json({ message: "Internal server error" });
            }
        });
        this.followOrUnfollowUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.user.userId;
            const userIdToFollow = req.params.userId;
            console.log("tryToFollowOrUnfollowUser", userId, userIdToFollow);
            const user = yield this.userService.findById(userId);
            const userToFollow = yield this.userService.findById(Number(userIdToFollow));
            if (!user || !userToFollow) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            else if (user.getId === userToFollow.getId) {
                res.status(400).json({ message: "You cannot follow yourself" });
                return;
            }
            try {
                yield this.userService.followOrUnfollowUser(user, userToFollow);
                res.status(200).json({ message: "User followed successfully" });
            }
            catch (error) {
                res.status(500).json({ message: "Could not follow user", error: error.toString() });
            }
        });
        this.checkIfFollowsUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.user.userId;
            const userIdToCheck = req.params.userId;
            const user = yield this.userService.findById(userId);
            const userToCheck = yield this.userService.findById(Number(userIdToCheck));
            if (!user || !userToCheck) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            const follows = yield this.userService.checkIfFollowsUser(user, userToCheck);
            res.status(200).json({ follows });
        });
    }
};
UserV2Controller = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(Types_1.Types.IUserDomainService)),
    __metadata("design:paramtypes", [Object])
], UserV2Controller);
exports.default = UserV2Controller;
