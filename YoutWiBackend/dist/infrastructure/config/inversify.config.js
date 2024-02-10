"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.myContainer = void 0;
const inversify_1 = require("inversify");
const types_1 = require("./types");
const UserDomainService_1 = require("../../domain/services/UserDomainService");
const userDatabaseService_1 = require("../services/userDatabaseService");
const AuthController_1 = __importDefault(require("../adapters/primary/rest/AuthController"));
const VideoDatabaseService_1 = require("../services/VideoDatabaseService");
const VideoDomainService_1 = require("../../domain/services/VideoDomainService");
const VideoController_1 = __importDefault(require("../adapters/primary/rest/VideoController"));
const myContainer = new inversify_1.Container();
exports.myContainer = myContainer;
// Aquí registrarás tus dependencias
myContainer.bind(types_1.TYPES.IUserRepository).to(userDatabaseService_1.UserDatabaseService);
myContainer.bind(types_1.TYPES.IUserDomainService).to(UserDomainService_1.UserDomainService);
myContainer.bind(types_1.TYPES.AuthController).to(AuthController_1.default);
myContainer.bind(types_1.TYPES.IVideoRepository).to(VideoDatabaseService_1.VideoDatabaseService);
myContainer.bind(types_1.TYPES.IVideoDomainService).to(VideoDomainService_1.VideoDomainService);
myContainer.bind(types_1.TYPES.VideoController).to(VideoController_1.default);
