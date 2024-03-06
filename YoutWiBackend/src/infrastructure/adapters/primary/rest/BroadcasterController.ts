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
        const userId: string = req.user.userId; // Asumiendo que el userId viene del token de autenticación

        // El array de canales seguidos ya viene en el body de la request
        const follows: Broadcaster[] = req.body.follows;

        if (!follows || follows.length === 0) {
            return res.status(400).json({ message: 'No broadcasters provided' });
        }

        try {
            await this.broadcasterDomainService.saveFollowed(userId, follows);
            res.status(200).json({ message: 'Broadcasters saved successfully' });
        } catch (error) {
            console.error('Error saving broadcasters:', error);
            res.status(500).json({ message: 'Failed to save broadcasters' });
        }
    };

    public findUserFollowedBroadcasters = async (req: Request, res: Response) => {
        const userId: string = req.user.userId;
        console.log('userId:', userId);
        const twitchClientId = process.env.TWITCH_CLIENT_ID ?? "";

        try {
            const broadcasters = await this.broadcasterDomainService.findUserFollowedBroadcasters(userId);
            const broadcasterIds = broadcasters.map(broadcaster => broadcaster.id);

            const isLive = await this.checkIfBroadcastersAreLive(broadcasterIds, twitchClientId);
            const liveBroadcasters = broadcasters.filter(broadcaster => isLive[broadcaster.id]);

            res.status(200).json(liveBroadcasters);
        } catch (error) {
            console.error('Error finding broadcasters:', error);
            res.status(500).json({ message: 'Failed to find broadcasters' });
        }
    }

    private async checkIfBroadcastersAreLive(broadcasterIds: string[], clientId: string): Promise<{[key: string]: boolean}> {
        const twitchAppAccessToken = await this.getTwitchAppAccessToken();
        const url = `https://api.twitch.tv/helix/streams?${broadcasterIds.map(id => `user_id=${id}`).join('&')}`;
        const headers = {
            'Client-ID': clientId,
            Authorization: `Bearer ${twitchAppAccessToken}`
        };

        try {
            const response = await axios.get(url, { headers });
            const liveBroadcasters = response.data.data.reduce((acc: {[key: string]: boolean}, broadcaster: any) => {
                acc[broadcaster.user_id] = true;
                return acc;
            }, {});

            return liveBroadcasters;
        } catch (error) {
            console.error('Error checking if broadcasters are live:', error);
            return {};
        }
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

export default BroadcasterController;
