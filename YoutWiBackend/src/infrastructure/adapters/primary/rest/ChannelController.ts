import {inject, injectable} from "inversify";
import {TYPES} from "../../../config/types";
import {IChannelDomainService} from "../../../../domain/port/primary/IChannelDomainService";
import {Channel} from "../../../../domain/models/Channel";
import {Request, Response} from "express";



@injectable()
class ChannelController {
    constructor(@inject(TYPES.IChannelDomainService) private channelDomainService: IChannelDomainService) {}

    public saveChannels = async (req: Request, res: Response) => {
        const channels: Channel[] = req.body;
        console.log('Saving channels:', JSON.stringify(channels[0]));
        try {
            await this.channelDomainService.saveChannels(channels);
            res.status(200).json({ message: 'Channels saved successfully' });
        } catch (error) {
            console.error('Error saving channels:', error);
            res.status(500).json({ message: 'Failed to save channels' });
        }
    }

}

export default ChannelController;