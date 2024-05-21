import 'reflect-metadata';
import { Channel } from "../../../../src/domain/models/Channel";
import { VideoDatabaseService } from "../../../../src/infrastructure/adapters/secondary/services/VideoDatabaseService";
import { Video } from "../../../../src/domain/models/Video";
import { executeQuery } from "../../../../src/infrastructure/config/Neo4jDataSource";

jest.mock('../../../../src/infrastructure/config/Neo4jDataSource');

describe('VideoDatabaseService', () => {
    let service: VideoDatabaseService;

    beforeEach(() => {
        service = new VideoDatabaseService();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should save liked videos for a user', async () => {
        const userId = '1';
        const channel = new Channel();
        channel.id = 'c1';
        const videos: Video[] = [
            { id: 'v1', title: 'Video One', updatedAt: new Date(), channel, suscribers: 0, deletedAt: new Date(), createdAt: new Date(), image: 'image1.png' },
            { id: 'v2', title: 'Video Two', updatedAt: new Date(), channel, suscribers: 0, deletedAt: new Date(), createdAt: new Date(), image: 'image1.png' },
        ];

        await service.saveLikedVideosForUser(userId, videos);

        expect(executeQuery).toHaveBeenCalledTimes(2);
        videos.forEach(video => {
            expect(executeQuery).toHaveBeenCalledWith(expect.stringContaining('MERGE (v:Video {id: $videoId})'), {
                userId: Number(userId),
                videoId: video.id,
                title: video.title,
                createdAt: video.updatedAt,
                channelId: channel.id
            });
        });
    });

    it('should save videos', async () => {
        const channel = new Channel();
        channel.id = 'c1';
        const videos: Video[] = [
            { id: 'v1', title: 'Video One', updatedAt: new Date(), channel, suscribers: 0, deletedAt: new Date(), createdAt: new Date(), image: 'image1.png' },
            { id: 'v2', title: 'Video Two', updatedAt: new Date(), channel, suscribers: 0, deletedAt: new Date(), createdAt: new Date(), image: 'image1.png' },
        ];

        await service.saveVideos(videos);

        expect(executeQuery).toHaveBeenCalledTimes(2);
        videos.forEach(video => {
            expect(executeQuery).toHaveBeenCalledWith(expect.stringContaining('MERGE (v:Video {id: $videoId})'), {
                videoId: video.id,
                title: video.title,
                createdAt: video.updatedAt,
                updatedAt: expect.any(String),
                channelId: channel.id
            });
        });
    });

    it('should find videos for a user', async () => {
        const userId = '1';
        const mockResult = [
            {
                get: jest.fn().mockReturnValue({
                    id: 'v1',
                    title: 'Video One',
                    createdAt: '2023-01-01T00:00:00Z',
                    updatedAt: '2023-01-01T00:00:00Z',
                    channelId: 'c1',
                    channelTitle: 'Channel One',
                    channelImage: 'image1.png'
                }),
            },
        ];

        (executeQuery as jest.Mock).mockResolvedValue(mockResult);

        const result = await service.findVideosForUser(userId);

        expect(executeQuery).toHaveBeenCalledWith(expect.stringContaining('MATCH (u:User {id: $userId})-[:SUBSCRIBED]->(c:Channel)<-[:BELONGS_TO]-(v:Video)'), { userId: Number(userId) });
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('v1');
    });

    it('should find video by id', async () => {
        const videoId = 'v1';
        const mockResult = [
            {
                get: jest.fn().mockImplementation((key: string) => {
                    const data: { [key: string]: string } = {
                        id: 'v1',
                        title: 'Video One',
                        createdAt: '2023-01-01T00:00:00Z',
                        updatedAt: '2023-01-01T00:00:00Z',
                        channelId: 'c1',
                        channelTitle: 'Channel One',
                        channelImage: 'image1.png'
                    };
                    return data[key];
                }),
            },
        ];

        (executeQuery as jest.Mock).mockResolvedValue(mockResult);

        const result = await service.findById(videoId);

        expect(executeQuery).toHaveBeenCalledWith(expect.stringContaining('MATCH (v:Video {id: $videoId})'), { videoId });
        expect(result).not.toBeNull();
        expect(result!.id).toBe('v1');
        expect(result!.channel.id).toBe('c1');
    });

    it('should find all videos', async () => {
        const mockResult = [
            {
                get: jest.fn().mockImplementation((key: string) => {
                    const data: { [key: string]: string } = {
                        id: 'v1',
                        title: 'Video One',
                        createdAt: '2023-01-01T00:00:00Z',
                        updatedAt: '2023-01-01T00:00:00Z',
                        channelId: 'c1',
                        channelTitle: 'Channel One',
                        channelImage: 'image1.png'
                    };
                    return data[key];
                }),
            },
            {
                get: jest.fn().mockImplementation((key: string) => {
                    const data: { [key: string]: string } = {
                        id: 'v2',
                        title: 'Video Two',
                        createdAt: '2023-01-02T00:00:00Z',
                        updatedAt: '2023-01-02T00:00:00Z',
                        channelId: 'c1',
                        channelTitle: 'Channel One',
                        channelImage: 'image1.png'
                    };
                    return data[key];
                }),
            },
        ];

        (executeQuery as jest.Mock).mockResolvedValue(mockResult);

        const result = await service.findAllVideos();

        expect(result).toHaveLength(2);
        expect(result[0].id).toBe('v1');
        expect(result[1].id).toBe('v2');
    });

    it('should save watched video for a user', async () => {
        const userId = '1';
        const videoId = 'v1';

        await service.saveWatchedVideo(videoId, userId);

        expect(executeQuery).toHaveBeenCalledWith(expect.stringContaining('MERGE (u)-[:WATCHED]->(v)'), {
            userId: Number(userId),
            videoId
        });
    });
});
