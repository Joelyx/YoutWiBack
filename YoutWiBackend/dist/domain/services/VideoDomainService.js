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
exports.VideoDomainService = void 0;
const inversify_1 = require("inversify");
const Types_1 = require("../../infrastructure/config/Types");
let VideoDomainService = class VideoDomainService {
    constructor(repository) {
        this.repository = repository;
    }
    saveLikedVideos(userId, videos) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repository.saveLikedVideosForUser(userId, videos);
        });
    }
    saveVideos(videos) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repository.saveVideos(videos);
        });
    }
    findVideosForUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.findVideosForUser(userId);
        });
    }
    findById(videoId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.findById(videoId);
        });
    }
    findAllVideos() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.findAllVideos();
        });
    }
};
exports.VideoDomainService = VideoDomainService;
exports.VideoDomainService = VideoDomainService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(Types_1.Types.IVideoRepository)),
    __metadata("design:paramtypes", [Object])
], VideoDomainService);
