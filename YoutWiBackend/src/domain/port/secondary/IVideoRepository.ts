import {Video} from "../../models/Video";


export interface IVideoRepository {
    saveLikedVideosForUser(userId: string, videos: Video[]): Promise<void>;
    saveVideos(videos: Video[]): Promise<void>;
    findVideosForUser(userId: string): Promise<Video[]>;
}
