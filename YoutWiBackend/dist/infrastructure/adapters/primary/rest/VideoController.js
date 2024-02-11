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
const VideoDomainService_1 = require("../../../../domain/services/VideoDomainService");
const Types_1 = require("../../../config/Types");
const inversify_1 = require("inversify");
let VideoController = class VideoController {
    constructor(videoDomainService) {
        this.videoDomainService = videoDomainService;
        this.saveLikedUserVideos = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const videos = req.body; // Asegúrate de que el cuerpo de la petición cumpla con la estructura esperada
            const userId = req.user.userId; // Asegúrate de que el tipo coincide con cómo se establece en el middleware
            //console.log(JSON.stringify(videos[0]));
            try {
                yield this.videoDomainService.saveLikedVideos(userId, videos);
                res.status(200).json({ message: 'Liked videos saved successfully' });
            }
            catch (error) {
                console.error('Error saving liked videos:', error);
                res.status(500).json({ message: 'Failed to save liked videos' });
            }
        });
    }
};
VideoController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(Types_1.Types.IVideoDomainService)),
    __metadata("design:paramtypes", [VideoDomainService_1.VideoDomainService])
], VideoController);
exports.default = VideoController;
