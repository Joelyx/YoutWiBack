import {inject, injectable} from "inversify";
import {Types} from "../../../config/Types";
import {IChannelDomainService} from "../../../../domain/port/primary/IChannelDomainService";
import {Channel} from "../../../../domain/models/Channel";
import {Request, Response} from "express";


@injectable()
class ChannelController {

    constructor(@inject(Types.IChannelDomainService) private channelDomainService: IChannelDomainService) {}

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

    public findChannelsWithoutUpdate = async (req: Request, res: Response) => {
        try {
            let channels = await this.channelDomainService.findChannelsWithoutUpdate();
            res.status(200).json(channels);
        } catch (error) {
            console.error('Error finding channels without update:', error);
            res.status(500).json({ message: 'Failed to find channels without update' });
        }
    }

    public findChannel = async (req: Request, res: Response) => {
        const channelId: string = req.params.channelId;
        try {
            let channel = await this.channelDomainService.findChannel(channelId);
            res.status(200).json(channel);
        } catch (error) {
            console.error('Error finding channel:', error);
            res.status(500).json({ message: 'Failed to find channel' });
        }
    }


}

export default ChannelController;