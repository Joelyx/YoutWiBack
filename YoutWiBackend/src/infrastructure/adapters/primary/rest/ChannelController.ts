import {inject, injectable} from "inversify";
import {Types} from "../../../config/Types";
import {IChannelDomainService} from "../../../../domain/port/primary/IChannelDomainService";
import {Channel} from "../../../../domain/models/Channel";
import {Request, Response} from "express";


@injectable()
class ChannelController {

    constructor(@inject(Types.IChannelDomainService) private channelDomainService: IChannelDomainService) {}

    /**
     * @openapi
     * @tags ChannelController
     * @description This method is responsible for saving channels.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     * @returns {Promise<Response>} The response object.
     */
    public saveChannels = async (req: Request, res: Response) => {
        const channels: Channel[] = req.body;
        try {
            await this.channelDomainService.saveChannels(channels);
            res.status(200).json({ message: 'Channels saved successfully' });
        } catch (error) {
            console.error('Error saving channels:', error);
            res.status(500).json({ message: 'Failed to save channels' });
        }
    }

    /**
     * @openapi
     * @tags ChannelController
     * @description This method is responsible for saving subscribed channels.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     * @returns {Promise<Response>} The response object.
     */
    public saveSubscribed = async (req: Request, res: Response) => {
        const channels: Channel[] = req.body;
        const userId: string = req.user.userId;
        try {
            await this.channelDomainService.saveSubscribed(userId, channels);
            res.status(200).json({ message: 'Channels saved successfully' });
        } catch (error) {
            console.error('Error saving channels:', error);
            res.status(500).json({ message: 'Failed to save channels' });
        }
    }

    /**
     * @openapi
     * @tags ChannelController
     * @description This method is responsible for finding channels without updates.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     * @returns {Promise<Response>} The response object.
     */
    public findChannelsWithoutUpdate = async (req: Request, res: Response) => {
        try {
            let channels = await this.channelDomainService.findChannelsWithoutUpdate();
            res.status(200).json(channels);
        } catch (error) {
            console.error('Error finding channels without update:', error);
            res.status(500).json({ message: 'Failed to find channels without update' });
        }
    }

}

export default ChannelController;