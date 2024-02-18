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
const axios_1 = __importDefault(require("axios"));
let BroadcasterController = class BroadcasterController {
    constructor(broadcasterDomainService) {
        this.broadcasterDomainService = broadcasterDomainService;
        this.saveBroadcasters = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const broadcasters = req.body;
            try {
                yield this.broadcasterDomainService.saveBroadcasters(broadcasters);
                res.status(200).json({ message: 'Broadcasters saved successfully' });
            }
            catch (error) {
                console.error('Error saving broadcasters:', error);
                res.status(500).json({ message: 'Failed to save broadcasters' });
            }
        });
        this.saveFollowed = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { token } = req.body;
            let follows = [];
            const userResponse = yield axios_1.default.get('https://api.twitch.tv/helix/users', {
                headers: {
                    'Client-ID': process.env.TWITCH_CLIENT_ID,
                    Authorization: `Bearer ${token}`,
                },
            });
            if (userResponse.data.data.length > 0) {
                const userId = userResponse.data.data[0].id;
                // Obtén los canales seguidos por el usuario
                let followsResponse = yield axios_1.default.get(`https://api.twitch.tv/helix/channels/followed?user_id=${userId}`, {
                    headers: {
                        'Client-ID': process.env.TWITCH_CLIENT_ID,
                        Authorization: `Bearer ${token}`,
                    },
                });
                follows = followsResponse.data.data;
                console.log(follows);
            }
            else {
                throw new Error('No se pudo obtener la información del usuario de Twitch.');
            }
            const userId = req.user.userId;
            try {
                yield this.broadcasterDomainService.saveFollowed(userId, follows);
                res.status(200).json({ message: 'Broadcasters saved successfully' });
            }
            catch (error) {
                console.error('Error saving broadcasters:', error);
                res.status(500).json({ message: 'Failed to save broadcasters' });
            }
        });
        this.findUserFollowedBroadcasters = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.user.userId;
            try {
                const broadcasters = yield this.broadcasterDomainService.findUserFollowedBroadcasters(userId);
                res.status(200).json(broadcasters);
            }
            catch (error) {
                console.error('Error finding broadcasters:', error);
                res.status(500).json({ message: 'Failed to find broadcasters' });
            }
        });
    }
};
BroadcasterController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(Types_1.Types.IBroadcasterDomainService)),
    __metadata("design:paramtypes", [Object])
], BroadcasterController);
exports.default = BroadcasterController;
