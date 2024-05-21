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
const SupportMessageEntity_1 = require("../../entity/SupportMessageEntity");
const DataSource_1 = require("../../config/DataSource");
const SupportMessage_1 = require("../../../domain/models/SupportMessage");
class SupportMessageRepository {
    constructor() {
        this.supportMessageRepository = DataSource_1.AppDataSource.getRepository(SupportMessageEntity_1.SupportMessageEntity);
    }
    save(supportMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            const entity = this.mapToEntity(supportMessage);
            const savedEntity = yield this.supportMessageRepository.save(entity);
            return this.mapToSupportMessage(savedEntity);
        });
    }
    deleteById(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.supportMessageRepository.delete(messageId);
        });
    }
    findById(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            const entity = yield this.supportMessageRepository.findOne({ where: { id: messageId } });
            return entity ? this.mapToSupportMessage(entity) : null;
        });
    }
    findAllByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            userId = 26;
            const entities = yield this.supportMessageRepository.find({ where: { userId } });
            return entities.map(this.mapToSupportMessage);
        });
    }
    findRecentMessagesByUserId(userId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, limit = 10) {
            const entities = yield this.supportMessageRepository.find({
                where: { userId },
                order: { createdAt: 'DESC' },
                take: limit
            });
            return entities.map(this.mapToSupportMessage);
        });
    }
    findAllSupportMessages() {
        return __awaiter(this, void 0, void 0, function* () {
            const entities = yield this.supportMessageRepository.find();
            return entities.map(this.mapToSupportMessage);
        });
    }
    findAllUserMessages(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            userId = 26;
            const entities = yield this.supportMessageRepository.find({ where: { userId } });
            console.log(entities);
            return entities.map(this.mapToSupportMessage);
        });
    }
    mapToSupportMessage(entity) {
        const domainObject = new SupportMessage_1.SupportMessage();
        domainObject.id = entity.id;
        domainObject.userId = entity.userId;
        domainObject.message = entity.message;
        domainObject.createdAt = entity.createdAt;
        domainObject.isFromSupport = entity.isFromSupport;
        return domainObject;
    }
    mapToEntity(domain) {
        const entity = new SupportMessageEntity_1.SupportMessageEntity();
        entity.id = domain.id;
        entity.userId = domain.userId;
        entity.message = domain.message;
        entity.createdAt = domain.createdAt;
        entity.isFromSupport = domain.isFromSupport;
        return entity;
    }
}
exports.default = new SupportMessageRepository();
