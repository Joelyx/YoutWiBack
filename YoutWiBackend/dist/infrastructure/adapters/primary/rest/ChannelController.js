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
let ChannelController = class ChannelController {
    constructor(channelDomainService) {
        this.channelDomainService = channelDomainService;
        /**
         * @openapi
         * @tags ChannelController
         * @description This method is responsible for saving channels.
         * @param {Request} req - The request object.
         * @param {Response} res - The response object.
         * @returns {Promise<Response>} The response object.
         */
        this.saveChannels = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const channels = req.body;
            try {
                yield this.channelDomainService.saveChannels(channels);
                res.status(200).json({ message: 'Channels saved successfully' });
            }
            catch (error) {
                console.error('Error saving channels:', error);
                res.status(500).json({ message: 'Failed to save channels' });
            }
        });
        /**
         * @openapi
         * @tags ChannelController
         * @description This method is responsible for saving subscribed channels.
         * @param {Request} req - The request object.
         * @param {Response} res - The response object.
         * @returns {Promise<Response>} The response object.
         */
        this.saveSubscribed = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const channels = req.body;
            const userId = req.user.userId;
            try {
                yield this.channelDomainService.saveSubscribed(userId, channels);
                res.status(200).json({ message: 'Channels saved successfully' });
            }
            catch (error) {
                console.error('Error saving channels:', error);
                res.status(500).json({ message: 'Failed to save channels' });
            }
        });
        /**
         * @openapi
         * @tags ChannelController
         * @description This method is responsible for finding channels without updates.
         * @param {Request} req - The request object.
         * @param {Response} res - The response object.
         * @returns {Promise<Response>} The response object.
         */
        this.findChannelsWithoutUpdate = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let channels = yield this.channelDomainService.findChannelsWithoutUpdate();
                res.status(200).json(channels);
            }
            catch (error) {
                console.error('Error finding channels without update:', error);
                res.status(500).json({ message: 'Failed to find channels without update' });
            }
        });
        this.findChannel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const channelId = req.params.channelId;
            try {
                let channel = yield this.channelDomainService.findChannel(channelId);
                res.status(200).json(channel);
            }
            catch (error) {
                console.error('Error finding channel:', error);
                res.status(500).json({ message: 'Failed to find channel' });
            }
        });
    }
};
ChannelController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(Types_1.Types.IChannelDomainService)),
    __metadata("design:paramtypes", [Object])
], ChannelController);
exports.default = ChannelController;
