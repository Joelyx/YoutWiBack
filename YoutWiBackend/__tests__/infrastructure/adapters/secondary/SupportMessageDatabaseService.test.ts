import "reflect-metadata";

import { SupportMessageDatabaseService } from "../../../../src/infrastructure/adapters/secondary/services/SupportMessageDatabaseService";
import { SupportMessage } from "../../../../src/domain/models/SupportMessage";
import SupportMessageEntityRepository from "../../../../src/infrastructure/repositories/mysql/SupportMessageEntityRepository";

jest.mock("../../../../src/infrastructure/repositories/mysql/SupportMessageEntityRepository", () => ({
    deleteById: jest.fn(),
    findAllByUserId: jest.fn(),
    findAllSupportMessages: jest.fn(),
    findAllUserMessages: jest.fn(),
    findById: jest.fn(),
    findRecentMessagesByUserId: jest.fn(),
    save: jest.fn()
}));

describe('SupportMessageDatabaseService', () => {
    let service: SupportMessageDatabaseService;

    beforeEach(() => {
        service = new SupportMessageDatabaseService();
    });

    describe('deleteById', () => {
        it('should delete a message by id', async () => {
            const messageId = 1;
            await service.deleteById(messageId);
            expect(SupportMessageEntityRepository.deleteById).toHaveBeenCalledWith(messageId);
        });
    });

    describe('findAllByUserId', () => {
        it('should find all messages by user id', async () => {
            const userId = 1;
            await service.findAllByUserId(userId);
            expect(SupportMessageEntityRepository.findAllByUserId).toHaveBeenCalledWith(userId);
        });
    });

    describe('findAllSupportMessages', () => {
        it('should find all support messages', async () => {
            await service.findAllSupportMessages();
            expect(SupportMessageEntityRepository.findAllSupportMessages).toHaveBeenCalled();
        });
    });

    describe('findAllUserMessages', () => {
        it('should find all user messages', async () => {
            const userId = 1;
            await service.findAllUserMessages(userId);
            expect(SupportMessageEntityRepository.findAllUserMessages).toHaveBeenCalledWith(userId);
        });
    });

    describe('findById', () => {
        it('should find a message by id', async () => {
            const messageId = 1;
            await service.findById(messageId);
            expect(SupportMessageEntityRepository.findById).toHaveBeenCalledWith(messageId);
        });
    });

    describe('findRecentMessagesByUserId', () => {
        it('should find recent messages by user id', async () => {
            const userId = 1;
            const limit = 5;
            await service.findRecentMessagesByUserId(userId, limit);
            expect(SupportMessageEntityRepository.findRecentMessagesByUserId).toHaveBeenCalledWith(userId, limit);
        });
    });

    describe('save', () => {
        it('should save a support message', async () => {
            const supportMessage = new SupportMessage();
            await service.save(supportMessage);
            expect(SupportMessageEntityRepository.save).toHaveBeenCalledWith(supportMessage);
        });
    });
});
