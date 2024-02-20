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
let PostController = class PostController {
    constructor(service) {
        this.service = service;
    }
    /**
     * Recibe la id del video y el contenido del post
     * @param req
     * @param res
     */
    savePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.user.email;
            console.log(this.service);
            const { videoId, content } = req.body;
            /*let user = await this.userService.findByEmail(userId);
            let video = await this.videoService.findById(videoId);
            let post = new Post();
            if(user != null && video != null){
                post.user = user;
                post.video = video;
                post.content = content;
                post.createdAt = new Date();
                post.likes = 0;
            }else {
                res.status(404).json({message: "User or video not found"});
            }
    
            await this.service.savePost(post);*/
            res.status(200).json({ message: "Post saved successfully" });
        });
    }
    findPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const postId = req.params.postId;
            let post = yield this.service.findPost(postId);
            if (post) {
                res.status(200).json(post);
            }
            else {
                res.status(404).json({ message: "Post not found" });
            }
        });
    }
    findPostComments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const postId = req.params.postId;
            let comments = yield this.service.findPostComments(postId);
            if (comments) {
                res.status(200).json(comments);
            }
            else {
                res.status(404).json({ message: "Comments not found" });
            }
        });
    }
    findPostsWithLimitAndOffset(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const limit = parseInt(req.query.limit);
            const offset = parseInt(req.query.offset);
            let posts = yield this.service.findPostsWithLimitAndOffset(limit, offset);
            if (posts) {
                res.status(200).json(posts);
            }
            else {
                res.status(404).json({ message: "Posts not found" });
            }
        });
    }
};
PostController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(Types_1.Types.IPostDomainService)),
    __metadata("design:paramtypes", [Object])
], PostController);
exports.default = PostController;
