import {IVideoDomainService} from "../port/primary/IVideoDomainService";
import {IVideoRepository} from "../port/secondary/IVideoRepository";
import {Video} from "../models/Video";
import {inject, injectable} from "inversify";
import {Types} from "../../infrastructure/config/Types";

@injectable()
export class VideoDomainService implements IVideoDomainService {
    constructor(@inject(Types.IVideoRepository) private repository: IVideoRepository) {}

    async saveLikedVideos(userId: string, videos: Video[]): Promise<void> {

        await this.repository.saveLikedVideosForUser(userId, videos);
    }

    async saveVideos(videos: Video[]): Promise<void> {
        await this.repository.saveVideos(videos);
    }

    async findVideosForUser(userId: string): Promise<Video[]> {
        return await this.repository.findVideosForUser(userId);
    }

    async getVideo(videoId: string): Promise<Video | null> {
        return await this.repository.getVideo(videoId);
    }


}

