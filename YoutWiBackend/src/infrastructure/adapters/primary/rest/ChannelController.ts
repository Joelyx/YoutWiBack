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
        //console.log('Saving channels:', JSON.stringify(channels[0]));
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
        const userId: string = req.user.userId; // Asegúrate de que el tipo coincide con cómo se establece en el middleware
        //console.log('Saving channels:', JSON.stringify(channels[0]));
        try {
            await this.channelDomainService.saveSubscribed(userId, channels);
            res.status(200).json({ message: 'Channels saved successfully' });
        } catch (error) {
            console.error('Error saving channels:', error);
            res.status(500).json({ message: 'Failed to save channels' });
        }
    }

}

export default ChannelController;