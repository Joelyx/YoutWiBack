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

    public findVideosForUser = async (req: Request, res: Response): Promise<void> => {
        const userId: string = req.user.userId;
        try {
            const videos: Video[] = await this.videoDomainService.findVideosForUser(userId);
            res.status(200).json(videos);
        } catch (error) {
            console.error('Error finding videos for user:', error);
            res.status(500).json({ message: 'Failed to find videos for user' });
        }
    }

    public getVideo = async (req: Request, res: Response): Promise<void> => {
        console.log('getVideo');
        const videoId: string = req.params.videoId;
        console.log('videoId:', videoId)
        try {
            const video: Video | null = await this.videoDomainService.findById(videoId);
            if (video) {
                console.log("enviado")
                res.status(200).json(video);
            } else {
                res.status(404).json({ message: 'Video not found' });
            }
        } catch (error) {
            console.error('Error getting video:', error);
            res.status(500).json({ message: 'Failed to get video' });
        }
    }

}

export default VideoController;