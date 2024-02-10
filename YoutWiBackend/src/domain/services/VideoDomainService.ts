import {IVideoDomainService} from "../port/primary/IVideoDomainService";
import {IVideoRepository} from "../port/secondary/IVideoRepository";
import {Video} from "../models/Video";
import {inject, injectable} from "inversify";
import {TYPES} from "../../infrastructure/config/types";

@injectable()
export class VideoDomainService implements IVideoDomainService {
    constructor(@inject(TYPES.IVideoRepository) private repository: IVideoRepository) {}

    async saveLikedVideos(userId: string, videos: Video[]): Promise<void> {
        // Aquí puedes añadir cualquier lógica de negocio adicional necesaria,
        // como validaciones, transformaciones, eventos de dominio, etc.
        await this.repository.saveLikedVideosForUser(userId, videos);
    }
}

