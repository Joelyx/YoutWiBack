import {Video} from "../../models/Video";


export interface IVideoDomainService {
    saveLikedVideos(userId: string, videos: Video[]): Promise<void>;
}
