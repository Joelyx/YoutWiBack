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
class SupportMessageRepository {
    constructor() {
        this.supportMessageRepository = DataSource_1.AppDataSource.getRepository(SupportMessageEntity_1.SupportMessageEntity);
    }
    save(supportMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.supportMessageRepository.save(supportMessage);
        });
    }
    deleteById(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.supportMessageRepository.delete(messageId);
        });
    }
    findById(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.supportMessageRepository.findOne({ where: { id: messageId } });
        });
    }
    findAllByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.supportMessageRepository.find({ where: { userId } });
        });
    }
    findRecentMessagesByUserId(userId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, limit = 10) {
            return this.supportMessageRepository.find({
                where: { userId },
                order: { createdAt: 'DESC' },
                take: limit
            });
        });
    }
    findAllSupportMessages() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.supportMessageRepository.find({ where: { isFromSupport: true } });
        });
    }
    findAllUserMessages(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.supportMessageRepository.find({ where: { userId, isFromSupport: false } });
        });
    }
}
exports.default = new SupportMessageRepository();
