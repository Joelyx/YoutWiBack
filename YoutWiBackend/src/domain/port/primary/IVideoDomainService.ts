import {Video} from "../../models/Video";


export interface IVideosService {
    saveLikedVideos(userId: string, videos: Video[]): Promise<void>;
}
