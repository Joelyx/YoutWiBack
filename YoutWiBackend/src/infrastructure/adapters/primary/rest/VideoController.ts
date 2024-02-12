import {myContainer} from "../../../config/inversify.config";
import {VideoDomainService} from "../../../../domain/services/VideoDomainService";
import {Types} from "../../../config/Types";
import {Request, Response} from "express";
import {Video} from "../../../../domain/models/Video";
import {inject, injectable} from "inversify";
import {IVideoDomainService} from "../../../../domain/port/primary/IVideoDomainService";

/**
 * @openapi
 * @tags VideoController
 * @description This class is responsible for handling video related operations.
 */
@injectable()
class VideoController {

    /**
     * @openapi
     * @tags VideoController
     * @description This constructor injects the IVideoDomainService into the VideoController.
     * @param {IVideoDomainService} videoDomainService - The service to be injected.
     */
    constructor(
        @inject(Types.IVideoDomainService) private videoDomainService: IVideoDomainService
    ) {
    }

    /**
     * @openapi
     * @tags VideoController
     * @description This method is responsible for saving liked user videos.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     * @returns {Promise<void>} The response object.
     */
    public saveLikedUserVideos = async (req: Request, res: Response): Promise<void> => {
        const videos: Video[] = req.body;
        const userId: string = req.user.userId;
        try {
            await this.videoDomainService.saveLikedVideos(userId, videos);
            res.status(200).json({ message: 'Liked videos saved successfully' });
        } catch (error) {
            console.error('Error saving liked videos:', error);
            res.status(500).json({ message: 'Failed to save liked videos' });
        }
    }

    /**
     * @openapi
     * @tags VideoController
     * @description This method is responsible for saving videos.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     * @returns {Promise<void>} The response object.
     */
    public saveVideos = async (req: Request, res: Response): Promise<void> => {
        const videos: Video[] = req.body;
        try {
            await this.videoDomainService.saveVideos(videos);
            res.status(200).json({ message: 'Videos saved successfully' });
        } catch (error) {
            console.error('Error saving videos:', error);
            res.status(500).json({ message: 'Failed to save videos' });
        }
    }

}

export default VideoController;