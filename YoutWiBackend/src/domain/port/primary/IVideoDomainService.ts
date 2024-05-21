import {Video} from "../../models/Video";


export interface IVideoDomainService {
    saveLikedVideos(userId: string, videos: Video[]): Promise<void>;
    saveVideos(videos: Video[]): Promise<void>;
    findVideosForUser(userId: string): Promise<Video[]>;
    findById(videoId: string): Promise<Video | null>;
    findAllVideos(): Promise<Video[]>;
    saveWatchedVideo(videoId: string, userId: string): Promise<void>;
}
