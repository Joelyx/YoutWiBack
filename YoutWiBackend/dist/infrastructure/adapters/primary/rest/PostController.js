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
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const Types_1 = require("../../../config/Types");
const Post_1 = require("../../../../domain/models/Post");
const User_1 = require("../../../../domain/models/User");
let PostController = class PostController {
    constructor(postDomainService, userService, videoService) {
        this.postDomainService = postDomainService;
        this.userService = userService;
        this.videoService = videoService;
        this.savePost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.user.email;
            const { videoId, content } = req.body;
            console.log(this.postDomainService);
            let user = yield this.userService.findByEmail(userId);
            let video = yield this.videoService.findById(videoId);
            let post = new Post_1.Post();
            if (user != null && video != null) {
                post.user = user;
                post.video = video;
                post.content = content;
                post.createdAt = new Date();
                post.likes = 0;
            }
            else {
                res.status(404).json({ message: "User or video not found" });
            }
            yield this.postDomainService.savePost(post);
            res.status(200).json({ message: "Post saved successfully" });
        });
        this.findPostsWithLimitAndOffset = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const limit = (_a = parseInt(req.query.limit)) !== null && _a !== void 0 ? _a : 50;
            const offset = (_b = parseInt(req.query.offset)) !== null && _b !== void 0 ? _b : 0;
            let posts = yield this.postDomainService.findPostsWithLimitAndOffset(50, 0);
            if (posts) {
                res.status(200).json(posts);
            }
            else {
                res.status(404).json({ message: "Posts not found" });
            }
        });
        this.findPostComments = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const postId = req.params.postId;
            let comments = yield this.postDomainService.findPostComments(postId);
            console.log(comments);
            if (comments) {
                res.status(200).json(comments);
            }
            else {
                res.status(404).json({ message: "Comments not found" });
            }
        });
        this.savePostComment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const postId = req.params.postId;
            console.log(postId);
            const userId = req.user.userId;
            let comment = req.body.comment;
            let user = new User_1.User();
            user.setId = Number(userId);
            comment.user = user;
            console.log(comment);
            yield this.postDomainService.savePostComment(postId, comment);
            res.status(200).json({ message: "Comment saved successfully" });
        });
        this.likePost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const postId = req.params.postId;
            const userId = req.user.userId;
            try {
                let number = yield this.postDomainService.likePost(postId, userId);
                console.log(number);
                if (number != null) {
                    if (number == 0) {
                        res.status(500).json({ message: "Error al dar/quitar likes" });
                    }
                    else if (number == 1) {
                        res.status(200).json({ message: "true" });
                    }
                    else {
                        res.status(200).json({ message: "false" });
                    }
                }
                else {
                    res.status(500).json({ message: "Error desconocido al dar/quitar likes" });
                }
            }
            catch (error) {
                console.error('Error procesando likePost', error);
                res.status(500).json({ message: "Error interno del servidor" });
            }
        });
    }
};
PostController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(Types_1.Types.IPostDomainService)),
    __param(1, (0, inversify_1.inject)(Types_1.Types.IUserDomainService)),
    __param(2, (0, inversify_1.inject)(Types_1.Types.IVideoDomainService)),
    __metadata("design:paramtypes", [Object, Object, Object])
], PostController);
exports.default = PostController;
