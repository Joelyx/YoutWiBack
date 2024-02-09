import {Video} from "../../models/Video";


export interface IVideoRepository {
    saveLikedVideosForUser(userId: string, videos: Video[]): Promise<void>;
}
