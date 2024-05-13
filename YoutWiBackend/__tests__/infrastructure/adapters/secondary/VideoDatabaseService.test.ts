import { VideoDatabaseService } from "../../../../src/infrastructure/adapters/secondary/services/VideoDatabaseService";
import {Video} from "../../../../src/domain/models/Video";
import {executeQuery} from "../../../../src/infrastructure/config/Neo4jDataSource";


jest.mock("../../../config/Neo4jDataSource", () => ({
    executeQuery: jest.fn()
}));

const mockedExecuteQuery = executeQuery as jest.Mock;

describe('VideoDatabaseService', () => {
    let service: VideoDatabaseService;

    beforeEach(() => {
        service = new VideoDatabaseService();
        jest.clearAllMocks();
    });

    describe('saveLikedVideosForUser', () => {
        it('should save multiple liked videos for a user', async () => {
            const userId = "1";
            const videos = [new Video(), new Video()];
            videos[0].id = "video1";
            videos[1].id = "video2";
            mockedExecuteQuery.mockResolvedValue({});

            await service.saveLikedVideosForUser(userId, videos);

            expect(mockedExecuteQuery).toHaveBeenCalledTimes(videos.length);
            expect(mockedExecuteQuery.mock.calls[0][0]).toContain("MERGE (v:Video {id: $videoId})");
            expect(mockedExecuteQuery.mock.calls[1][0]).toContain("MERGE (v:Video {id: $videoId})");
        });
    });

    describe('saveVideos', () => {
        it('should save multiple videos', async () => {
            const videos = [new Video(), new Video()];
            videos[0].id = "video1";
            videos[1].id = "video2";
            mockedExecuteQuery.mockResolvedValue({});

            await service.saveVideos(videos);

            expect(mockedExecuteQuery).toHaveBeenCalledTimes(videos.length);
            expect(mockedExecuteQuery.mock.calls[0][0]).toContain("MERGE (v:Video {id: $videoId})");
        });
    });


    describe('findVideosForUser', () => {
        it('should find videos for a user', async () => {
            const userId = "1";
            const mockVideos = [{ id: "video1", title: "Test Video" }];
            mockedExecuteQuery.mockResolvedValue(mockVideos.map(video => ({
                get: jest.fn().mockReturnValue({
                    id: video.id,
                    title: video.title,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })
            })));

            const result = await service.findVideosForUser(userId);

            if (result) {
                expect(mockedExecuteQuery).toHaveBeenCalledWith(expect.any(String), { userId: Number(userId) });
                expect(result).toHaveLength(1);
                expect(result[0].id).toEqual("video1");
            }
        });
    });

    describe('findById', () => {
        it('should find a video by ID', async () => {
            const videoId = "video1";
            mockedExecuteQuery.mockResolvedValueOnce([{
                get: jest.fn().mockReturnValue({
                    id: videoId,
                    title: "Test Video",
                    createdAt: "2020-01-01T00:00:00Z",
                    updatedAt: "2020-01-01T01:00:00Z",
                })
            }]);

            const result = await service.findById(videoId);

            expect(mockedExecuteQuery).toHaveBeenCalledWith(expect.any(String), { videoId });
            expect(result).toBeInstanceOf(Video);
            if(result)
            expect(result.id).toEqual(videoId);
        });
    });

    describe('findAllVideos', () => {
        it('should return all videos', async () => {
            mockedExecuteQuery.mockResolvedValue([{
                get: jest.fn().mockReturnValue({
                    id: "video1",
                    title: "Video Title",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                })
            }]);

            const result = await service.findAllVideos();

            expect(mockedExecuteQuery).toHaveBeenCalled();
            expect(result).toHaveLength(1);
            expect(result[0].title).toEqual("Video Title");
        });
    });

    describe('saveWatchedVideo', () => {
        it('should mark a video as watched by a user', async () => {
            const videoId = "video1";
            const userId = "1";
            mockedExecuteQuery.mockResolvedValue({});

            await service.saveWatchedVideo(videoId, userId);

            expect(mockedExecuteQuery).toHaveBeenCalledWith(expect.any(String), {
                userId: Number(userId),
                videoId
            });
        });
    });
});
