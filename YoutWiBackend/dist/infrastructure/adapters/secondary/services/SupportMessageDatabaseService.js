"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportMessageDatabaseService = void 0;
const inversify_1 = require("inversify");
const SupportMessageEntityRepository_1 = __importDefault(require("../../../repositories/mysql/SupportMessageEntityRepository"));
let SupportMessageDatabaseService = class SupportMessageDatabaseService {
    constructor() {
        this.SupportMessageRepository = SupportMessageEntityRepository_1.default;
    }
    deleteById(messageId) {
        return this.SupportMessageRepository.deleteById(messageId);
    }
    findAllByUserId(userId) {
        return this.SupportMessageRepository.findAllByUserId(userId);
    }
    findAllSupportMessages() {
        return this.SupportMessageRepository.findAllSupportMessages();
    }
    findAllUserMessages(userId) {
        return this.SupportMessageRepository.findAllUserMessages(userId);
    }
    findById(messageId) {
        return this.SupportMessageRepository.findById(messageId);
    }
    findRecentMessagesByUserId(userId, limit) {
        return this.SupportMessageRepository.findRecentMessagesByUserId(userId, limit);
    }
    save(supportMessage) {
        return this.SupportMessageRepository.save(supportMessage);
    }
};
exports.SupportMessageDatabaseService = SupportMessageDatabaseService;
exports.SupportMessageDatabaseService = SupportMessageDatabaseService = __decorate([
    (0, inversify_1.injectable)()
], SupportMessageDatabaseService);
