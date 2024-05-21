import "reflect-metadata";
import { ChannelDatabaseService } from "../../../../src/infrastructure/adapters/secondary/services/ChannelDatabaseService";
import { Channel } from "../../../../src/domain/models/Channel";
import { executeQuery } from "../../../../src/infrastructure/config/Neo4jDataSource";

jest.mock("../../../../src/infrastructure/config/Neo4jDataSource", () => ({
    executeQuery: jest.fn()
}));

describe('ChannelDatabaseService', () => {
    let service: ChannelDatabaseService;
    let mockExecuteQuery: jest.Mock;

    beforeEach(() => {
        service = new ChannelDatabaseService();
        mockExecuteQuery = executeQuery as jest.Mock;
        mockExecuteQuery.mockClear();
    });

    describe('saveChannels', () => {
        it('should execute a query for each channel', async () => {
            const channels = [new Channel(), new Channel()];
            channels[0].id = "1";
            channels[0].title = "Channel One";
            channels[0].description = "Description One";
            channels[0].image = "image1.jpg";

            channels[1].id = "2";
            channels[1].title = "Channel Two";
            channels[1].description = "Description Two";
            channels[1].image = "image2.jpg";

            await service.saveChannels(channels);
            expect(mockExecuteQuery).toHaveBeenCalledTimes(2);
        });

        it('should handle an empty array of channels', async () => {
            await service.saveChannels([]);
            expect(mockExecuteQuery).not.toHaveBeenCalled();
        });

        it('should throw an error if the database query fails', async () => {
            mockExecuteQuery.mockRejectedValue(new Error("Database error"));
            const channel = new Channel();
            channel.id = "3";
            channel.title = "Channel Three";
            channel.description = "Description Three";
            channel.image = "image3.jpg";

            await expect(service.saveChannels([channel])).rejects.toThrow("Database error");
        });
    });

    describe('saveSubscribed', () => {

        it('should handle an empty array of channels', async () => {
            await service.saveSubscribed("user1", []);
            expect(mockExecuteQuery).not.toHaveBeenCalled();
        });

        it('should throw an error if the database query fails', async () => {
            mockExecuteQuery.mockRejectedValue(new Error("Database error"));
            const channel = new Channel();
            channel.id = "2";
            channel.title = "Channel Two";
            channel.description = "Description Two";
            channel.image = "image2.jpg";

            await expect(service.saveSubscribed("user1", [channel])).rejects.toThrow("Database error");
        });
    });

    describe('findChannelsWithoutUpdate', () => {
        it('should return channels that have not been updated', async () => {
            mockExecuteQuery.mockResolvedValueOnce([
                {
                    get: (prop: any) => {
                        switch (prop) {
                            case 'id': return '1';
                            case 'title': return 'Channel One';
                            case 'description': return 'Old Channel';
                            case 'updatedAt': return null;
                            case 'subscribers': return 100;
                            case 'image': return 'image1.jpg';
                        }
                    }
                }
            ]);

            const result = await service.findChannelsWithoutUpdate();
            expect(result.length).toBe(1);
            expect(result[0].id).toBe('1');
            expect(result[0].title).toBe('Channel One');
        });

        it('should return an empty array if no channels are found', async () => {
            mockExecuteQuery.mockResolvedValueOnce([]);
            const result = await service.findChannelsWithoutUpdate();
            expect(result).toEqual([]);
        });

        it('should throw an error if the database query fails', async () => {
            mockExecuteQuery.mockRejectedValue(new Error("Database error"));
            await expect(service.findChannelsWithoutUpdate()).rejects.toThrow("Database error");
        });
    });

    describe('findChannel', () => {
        it('should return a specific channel by ID', async () => {
            mockExecuteQuery.mockResolvedValueOnce([
                {
                    get: (prop: any) => {
                        switch (prop) {
                            case 'id': return '1';
                            case 'title': return 'Channel One';
                            case 'description': return 'Description One';
                            case 'updatedAt': return '2021-01-01';
                            case 'subscribers': return 100;
                            case 'image': return 'image1.jpg';
                        }
                    }
                }
            ]);

            const result = await service.findChannel("1");
            expect(result.id).toBe('1');
            expect(result.title).toBe('Channel One');
        });

        it('should throw an error if the database query fails', async () => {
            mockExecuteQuery.mockRejectedValue(new Error("Database error"));
            await expect(service.findChannel("1")).rejects.toThrow("Database error");
        });
    });

});
