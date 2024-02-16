import {inject, injectable} from "inversify";
import {IBroadcasterDomainService} from "../../../../domain/port/primary/IBroadcasterDomainService";
import {Types} from "../../../config/Types";
import {Broadcaster} from "../../../../domain/models/Broadcaster";
import {Request, Response} from "express";



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
        const broadcasters: Broadcaster[] = req.body;
        const userId: string = req.user.userId;
        try {
            await this.broadcasterDomainService.saveFollowed(userId, broadcasters);
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
