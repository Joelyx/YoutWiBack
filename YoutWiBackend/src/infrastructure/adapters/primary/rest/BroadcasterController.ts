import {inject, injectable} from "inversify";
import {IBroadcasterDomainService} from "../../../../domain/port/primary/IBroadcasterDomainService";
import {Types} from "../../../config/Types";
import {Broadcaster} from "../../../../domain/models/Broadcaster";
import {Request, Response} from "express";
import axios from "axios";



@injectable()
class BroadcasterController {

    constructor(
        @inject(Types.IBroadcasterDomainService) private broadcasterDomainService: IBroadcasterDomainService
    ) {
    }

    public saveBroadcasters = async (req: Request, res: Response) => {
        const broadcasters: Broadcaster[] = req.body;
        try {
            await this.broadcasterDomainService.saveBroadcasters(broadcasters);
            res.status(200).json({ message: 'Broadcasters saved successfully' });
        } catch (error) {
            console.error('Error saving broadcasters:', error);
            res.status(500).json({ message: 'Failed to save broadcasters' });
        }
    }

    public saveFollowed = async (req: Request, res: Response) => {
        const {token} = req.body;
        let follows: Broadcaster[] = [];

        const userResponse = await axios.get('https://api.twitch.tv/helix/users', {
            headers: {
                'Client-ID': process.env.TWITCH_CLIENT_ID,
                Authorization: `Bearer ${token}`,
            },
        });

        if (userResponse.data.data.length > 0) {
            const userId = userResponse.data.data[0].id;

            // Obtén los canales seguidos por el usuario
            let followsResponse = await axios.get(
                `https://api.twitch.tv/helix/channels/followed?user_id=${userId}`,
                {
                    headers: {
                        'Client-ID': process.env.TWITCH_CLIENT_ID,
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            follows = followsResponse.data.data;

            console.log(follows);
        } else {
            throw new Error(
                'No se pudo obtener la información del usuario de Twitch.',
            );
        }
        const userId: string = req.user.userId;
        try {
            await this.broadcasterDomainService.saveFollowed(userId, follows);
            res.status(200).json({ message: 'Broadcasters saved successfully' });
        } catch (error) {
            console.error('Error saving broadcasters:', error);
            res.status(500).json({ message: 'Failed to save broadcasters' });
        }
    }

    public findUserFollowedBroadcasters = async (req: Request, res: Response) => {
        const userId: string = req.user.userId;
        try {
            const broadcasters = await this.broadcasterDomainService.findUserFollowedBroadcasters(userId);
            res.status(200).json(broadcasters);
        } catch (error) {
            console.error('Error finding broadcasters:', error);
            res.status(500).json({ message: 'Failed to find broadcasters' });
        }
    }
}

export default BroadcasterController;
