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
exports.ChannelDomainService = void 0;
const inversify_1 = require("inversify");
const Types_1 = require("../../infrastructure/config/Types");
let ChannelDomainService = class ChannelDomainService {
    constructor(repository) {
        this.repository = repository;
    }
    saveChannels(channels) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repository.saveChannels(channels);
        });
    }
    saveSubscribed(userid, channels) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repository.saveSubscribed(userid, channels);
        });
    }
    findChannelsWithoutUpdate() {
        return __awaiter(this, void 0, void 0, function* () {
            let channels = yield this.repository.findChannelsWithoutUpdate();
            // Filtrar los canales que llevan más de 1 semana sin actualizarse o que su fecha de actualización sea null
            channels = channels.filter(channel => {
                if (channel.updatedAt === null) {
                    return true;
                }
                // Asegúrate de que updatedAt es un objeto Date
                const updatedAt = new Date(channel.updatedAt);
                const now = new Date();
                const diff = now.getTime() - updatedAt.getTime();
                const days = diff / (1000 * 60 * 60 * 24);
                return days > 7;
            });
            // Cogemos los primeros 15 canales
            channels = channels.slice(0, 15);
            return channels;
        });
    }
    findChannel(channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.findChannel(channelId);
        });
    }
};
exports.ChannelDomainService = ChannelDomainService;
exports.ChannelDomainService = ChannelDomainService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(Types_1.Types.IChannelRepository)),
    __metadata("design:paramtypes", [Object])
], ChannelDomainService);
