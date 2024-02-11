"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.myContainer = void 0;
const inversify_1 = require("inversify");
const Types_1 = require("./Types");
const UserDomainService_1 = require("../../domain/services/UserDomainService");
const UserDatabaseService_1 = require("../services/UserDatabaseService");
const AuthController_1 = __importDefault(require("../adapters/primary/rest/AuthController"));
const VideoDatabaseService_1 = require("../services/VideoDatabaseService");
const VideoDomainService_1 = require("../../domain/services/VideoDomainService");
const VideoController_1 = __importDefault(require("../adapters/primary/rest/VideoController"));
const ChannelDatabaseService_1 = require("../services/ChannelDatabaseService");
const ChannelDomainService_1 = require("../../domain/services/ChannelDomainService");
const ChannelController_1 = __importDefault(require("../adapters/primary/rest/ChannelController"));
const myContainer = new inversify_1.Container();
exports.myContainer = myContainer;
// Aquí registrarás tus dependencias
myContainer.bind(Types_1.Types.IUserRepository).to(UserDatabaseService_1.UserDatabaseService);
myContainer.bind(Types_1.Types.IUserDomainService).to(UserDomainService_1.UserDomainService);
myContainer.bind(Types_1.Types.AuthController).to(AuthController_1.default);
myContainer.bind(Types_1.Types.IVideoRepository).to(VideoDatabaseService_1.VideoDatabaseService);
myContainer.bind(Types_1.Types.IVideoDomainService).to(VideoDomainService_1.VideoDomainService);
myContainer.bind(Types_1.Types.VideoController).to(VideoController_1.default);
myContainer.bind(Types_1.Types.IChannelRepository).to(ChannelDatabaseService_1.ChannelDatabaseService);
myContainer.bind(Types_1.Types.IChannelDomainService).to(ChannelDomainService_1.ChannelDomainService);
myContainer.bind(Types_1.Types.ChannelController).to(ChannelController_1.default);
