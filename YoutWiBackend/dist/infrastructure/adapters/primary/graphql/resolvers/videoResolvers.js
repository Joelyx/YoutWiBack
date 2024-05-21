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
const Video_1 = require("../../../../../domain/models/Video");
const inversify_config_1 = require("../../../../config/inversify.config");
const Types_1 = require("../../../../config/Types");
const videoDomainService = inversify_config_1.myContainer.get(Types_1.Types.IVideoDomainService);
const videoResolver = {
    Query: {
        getAllVideos: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, {}) {
            return videoDomainService.findAllVideos();
        }),
        getVideo: (_2, _b) => __awaiter(void 0, [_2, _b], void 0, function* (_, { id }) {
            return videoDomainService.findById(id);
        }),
    },
    Mutation: {
        createVideo: (_3, _c) => __awaiter(void 0, [_3, _c], void 0, function* (_, { title, id }) {
            const newVideo = new Video_1.Video();
            newVideo.title = title;
            newVideo.id = id;
            newVideo.createdAt = new Date();
            const videos = [newVideo];
            return videoDomainService.saveVideos(videos);
        }),
    },
};
exports.default = videoResolver;
