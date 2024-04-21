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
            console.error('Error saving broadcasters.yaml:', error);
            res.status(500).json({ message: 'Failed to save broadcasters.yaml' });
        }
    }

    public saveFollowed = async (req: Request, res: Response) => {
        const userId: string = req.user.userId; // Asumiendo que el userId viene del token de autenticación

        // El array de canales seguidos ya viene en el body de la request
        const follows: Broadcaster[] = req.body.follows;

        if (!follows || follows.length === 0) {
            return res.status(400).json({ message: 'No broadcasters.yaml provided' });
        }

        try {
            await this.broadcasterDomainService.saveFollowed(userId, follows);
            res.status(200).json({ message: 'Broadcasters saved successfully' });
        } catch (error) {
            console.error('Error saving broadcasters.yaml:', error);
            res.status(500).json({ message: 'Failed to save broadcasters.yaml' });
        }
    };

    public findUserFollowedBroadcasters = async (req: Request, res: Response) => {
        const userId: string = req.user.userId;
        console.log('userId:', userId);
        const twitchClientId = process.env.TWITCH_CLIENT_ID ?? "";

        try {
            const broadcasters = await this.broadcasterDomainService.findUserFollowedBroadcasters(userId);
            const broadcasterIds = broadcasters.map(broadcaster => broadcaster.id);

            const liveBroadcasters = await this.filterLiveBroadcasters(broadcasterIds, twitchClientId);

            res.status(200).json(liveBroadcasters);
        } catch (error) {
            console.error('Error finding broadcasters.yaml:', error);
            res.status(500).json({ message: 'Failed to find broadcasters.yaml' });
        }
    }

    private async filterLiveBroadcasters(broadcasterIds: string[], clientId: string): Promise<BroadcasterDTO[]> {
        const twitchAppAccessToken = await this.getTwitchAppAccessToken();
        let liveBroadcasters: BroadcasterDTO[] = [];

        const chunkSize = 100;
        for (let i = 0; i < broadcasterIds.length; i += chunkSize) {
            const chunk = broadcasterIds.slice(i, i + chunkSize);
            const url = `https://api.twitch.tv/helix/streams?user_id=${chunk.join('&user_id=')}`;
            const headers = {
                'Client-ID': clientId,
                Authorization: `Bearer ${twitchAppAccessToken}`
            };

            try {
                const streamsResponse = await axios.get(url, { headers });
                for (const broadcaster of streamsResponse.data.data) {
                    const userUrl = `https://api.twitch.tv/helix/users?id=${broadcaster.user_id}`;
                    try {
                        const userResponse = await axios.get(userUrl, { headers });
                        if (userResponse.data.data.length > 0) {
                            const user = userResponse.data.data[0];
                            //console.log('User:', user)
                            liveBroadcasters.push({
                                id: user.id,
                                name: user.login,
                                thumbnailUrl: user.offline_image_url,
                            });
                            console.log('Live broadcasters.yaml:', liveBroadcasters);
                        }
                    } catch (userError) {
                        console.error('Error fetching user details:', userError);
                    }
                }
            } catch (error) {
                console.error('Error checking if broadcasters.yaml are live:', error);
            }
        }

        console.log('AAAAAAAAAAAAAAAAAAAAA:', liveBroadcasters);
        return liveBroadcasters;
    }

    private async getTwitchAppAccessToken() {
        const clientId = process.env.TWITCH_CLIENT_ID;
        const clientSecret = process.env.TWITCH_CLIENT_SECRET;

        try {
            const response = await axios.post(`https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`);
            return response.data.access_token;
        } catch (error) {
            console.error('Error getting Twitch App Access Token:', error);
            return null;
        }
    };

}



type BroadcasterDTO = {
    id: string;
    name: string;
    thumbnailUrl: string;
}

export default BroadcasterController;
