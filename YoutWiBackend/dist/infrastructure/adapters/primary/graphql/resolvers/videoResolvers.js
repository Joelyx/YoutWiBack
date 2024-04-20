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
exports.videoResolvers = void 0;
const Video_1 = require("../../../../../domain/models/Video");
exports.videoResolvers = {
    Query: {
        getAllVideos: (_1, _a, _b) => __awaiter(void 0, [_1, _a, _b], void 0, function* (_, { limit = 10, offset = 0 }, { videoDomainService }) {
            return videoDomainService.findAllVideos();
        }),
        getVideo: (_2, _c, _d) => __awaiter(void 0, [_2, _c, _d], void 0, function* (_, { id }, { videoDomainService }) {
            return videoDomainService.findById(id);
        }),
    },
    Mutation: {
        createVideo: (_3, _e, _f) => __awaiter(void 0, [_3, _e, _f], void 0, function* (_, { title, id }, { videoDomainService }) {
            const newVideo = new Video_1.Video();
            newVideo.title = title;
            newVideo.id = id;
            newVideo.createdAt = new Date();
            const videos = [newVideo];
            return videoDomainService.saveVideos(videos);
        }),
    },
};
