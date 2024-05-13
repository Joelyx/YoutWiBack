import "reflect-metadata";
import { ChannelDatabaseService } from "../../../../src/infrastructure/adapters/secondary/services/ChannelDatabaseService";
import { Channel } from "../../../../src/domain/models/Channel";
import * as db from "../../../../src/infrastructure/config/Neo4jDataSource";

jest.mock("../../../../src/infrastructure/config/Neo4jDataSource", () => ({
    executeQuery: jest.fn()
}));

describe('ChannelDatabaseService', () => {
    let service: ChannelDatabaseService;
    let mockExecuteQuery: jest.Mock;

    beforeEach(() => {
        service = new ChannelDatabaseService();
        mockExecuteQuery = db.executeQuery as jest.Mock;
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
    });

    describe('saveSubscribed', () => {
        it('should save subscribed channels for a user', async () => {
            const channels = [new Channel()];
            channels[0].id = "1";
            channels[0].title = "Channel One";
            channels[0].description = "Description One";
            channels[0].image = "image1.jpg";

            await service.saveSubscribed("user1", channels);
            expect(mockExecuteQuery).toHaveBeenCalledTimes(1);
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
    });
});
