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


        it('should handle repository errors gracefully', async () => {
            (SupportMessageEntityRepository.deleteById as jest.Mock).mockRejectedValue(new Error("Repository error"));
            await expect(service.deleteById(1)).rejects.toThrow("Repository error");
        });
    });

    describe('findAllByUserId', () => {
        it('should find all messages by user id', async () => {
            const userId = 1;
            await service.findAllByUserId(userId);
            expect(SupportMessageEntityRepository.findAllByUserId).toHaveBeenCalledWith(userId);
        });

        it('should return an empty array if no messages are found', async () => {
            (SupportMessageEntityRepository.findAllByUserId as jest.Mock).mockResolvedValue([]);
            const result = await service.findAllByUserId(1);
            expect(result).toEqual([]);
        });

        it('should handle repository errors gracefully', async () => {
            (SupportMessageEntityRepository.findAllByUserId as jest.Mock).mockRejectedValue(new Error("Repository error"));
            await expect(service.findAllByUserId(1)).rejects.toThrow("Repository error");
        });
    });

    describe('findAllSupportMessages', () => {
        it('should find all support messages', async () => {
            await service.findAllSupportMessages();
            expect(SupportMessageEntityRepository.findAllSupportMessages).toHaveBeenCalled();
        });

        it('should return an empty array if no messages are found', async () => {
            (SupportMessageEntityRepository.findAllSupportMessages as jest.Mock).mockResolvedValue([]);
            const result = await service.findAllSupportMessages();
            expect(result).toEqual([]);
        });

        it('should handle repository errors gracefully', async () => {
            (SupportMessageEntityRepository.findAllSupportMessages as jest.Mock).mockRejectedValue(new Error("Repository error"));
            await expect(service.findAllSupportMessages()).rejects.toThrow("Repository error");
        });
    });

    describe('findAllUserMessages', () => {
        it('should find all user messages', async () => {
            const userId = 1;
            await service.findAllUserMessages(userId);
            expect(SupportMessageEntityRepository.findAllUserMessages).toHaveBeenCalledWith(userId);
        });

        it('should return an empty array if no messages are found', async () => {
            (SupportMessageEntityRepository.findAllUserMessages as jest.Mock).mockResolvedValue([]);
            const result = await service.findAllUserMessages(1);
            expect(result).toEqual([]);
        });

        it('should handle repository errors gracefully', async () => {
            (SupportMessageEntityRepository.findAllUserMessages as jest.Mock).mockRejectedValue(new Error("Repository error"));
            await expect(service.findAllUserMessages(1)).rejects.toThrow("Repository error");
        });
    });

    describe('findById', () => {
        it('should find a message by id', async () => {
            const messageId = 1;
            await service.findById(messageId);
            expect(SupportMessageEntityRepository.findById).toHaveBeenCalledWith(messageId);
        });

        it('should return null if no message is found', async () => {
            (SupportMessageEntityRepository.findById as jest.Mock).mockResolvedValue(null);
            const result = await service.findById(1);
            expect(result).toBeNull();
        });

        it('should handle repository errors gracefully', async () => {
            (SupportMessageEntityRepository.findById as jest.Mock).mockRejectedValue(new Error("Repository error"));
            await expect(service.findById(1)).rejects.toThrow("Repository error");
        });
    });

    describe('findRecentMessagesByUserId', () => {
        it('should find recent messages by user id', async () => {
            const userId = 1;
            const limit = 5;
            await service.findRecentMessagesByUserId(userId, limit);
            expect(SupportMessageEntityRepository.findRecentMessagesByUserId).toHaveBeenCalledWith(userId, limit);
        });

        it('should return an empty array if no recent messages are found', async () => {
            (SupportMessageEntityRepository.findRecentMessagesByUserId as jest.Mock).mockResolvedValue([]);
            const result = await service.findRecentMessagesByUserId(1, 5);
            expect(result).toEqual([]);
        });

        it('should handle repository errors gracefully', async () => {
            (SupportMessageEntityRepository.findRecentMessagesByUserId as jest.Mock).mockRejectedValue(new Error("Repository error"));
            await expect(service.findRecentMessagesByUserId(1, 5)).rejects.toThrow("Repository error");
        });
    });

    describe('save', () => {
        it('should save a support message', async () => {
            const supportMessage = new SupportMessage();
            await service.save(supportMessage);
            expect(SupportMessageEntityRepository.save).toHaveBeenCalledWith(supportMessage);
        });



        it('should handle repository errors gracefully', async () => {
            const supportMessage = new SupportMessage();
            (SupportMessageEntityRepository.save as jest.Mock).mockRejectedValue(new Error("Repository error"));
            await expect(service.save(supportMessage)).rejects.toThrow("Repository error");
        });

    });
});
