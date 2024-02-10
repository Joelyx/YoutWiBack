import {myContainer} from "../../../config/inversify.config";
import {VideoDomainService} from "../../../../domain/services/VideoDomainService";
import {TYPES} from "../../../config/types";
import {Request, Response} from "express";
import {Video} from "../../../../domain/models/Video";
import {inject, injectable} from "inversify";

@injectable()
class VideoController {

    constructor(
        @inject(TYPES.IVideoDomainService) private videoDomainService: VideoDomainService
    ) {
    }
    public saveLikedUserVideos = async (req: Request, res: Response): Promise<void> => {
        const videos: Video[] = req.body; // Asegúrate de que el cuerpo de la petición cumpla con la estructura esperada
        const userId: string = req.user.userId; // Asegúrate de que el tipo coincide con cómo se establece en el middleware
        console.log(JSON.stringify(videos[0]));
        try {
            await this.videoDomainService.saveLikedVideos(userId, videos);
            res.status(200).json({ message: 'Liked videos saved successfully' });
        } catch (error) {
            console.error('Error saving liked videos:', error);
            res.status(500).json({ message: 'Failed to save liked videos' });
        }
    }


}

export default VideoController;