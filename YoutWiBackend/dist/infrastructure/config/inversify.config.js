"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.myContainer = void 0;
const inversify_1 = require("inversify");
const types_1 = require("./types");
const userDomainService_1 = require("../../domain/services/userDomainService");
const userDatabaseService_1 = require("../services/userDatabaseService");
const AuthController_1 = __importDefault(require("../adapters/primary/rest/AuthController"));
const myContainer = new inversify_1.Container();
exports.myContainer = myContainer;
// Aquí registrarás tus dependencias
myContainer.bind(types_1.TYPES.IUserRepository).to(userDatabaseService_1.UserDatabaseService);
myContainer.bind(types_1.TYPES.IUserDomainService).to(userDomainService_1.UserDomainService);
myContainer.bind(types_1.TYPES.AuthController).to(AuthController_1.default);
