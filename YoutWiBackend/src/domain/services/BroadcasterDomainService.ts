import {inject, injectable} from "inversify";
import {IBroadcasterDomainService} from "../port/primary/IBroadcasterDomainService";
import {Types} from "../../infrastructure/config/Types";
import {IBroadcasterRepository} from "../port/secondary/IBroadcasterRepository";
import {Broadcaster} from "../models/Broadcaster";


@injectable()
export class BroadcasterDomainService implements IBroadcasterDomainService {
    private repository: IBroadcasterRepository;
    constructor(@inject(Types.IBroadcastRepository) repository: IBroadcasterRepository) {
        this.repository = repository;
    }
    saveBroadcasts = (broadcasts: Broadcaster[]) => this.repository.saveBroadcasters(broadcasts);
    saveBroadcasters = (broadcasters: Broadcaster[]) => this.repository.saveBroadcasters(broadcasters);
    saveFollowed = (userid: string, broadcasters: Broadcaster[]) => this.repository.saveFollowed(userid, broadcasters);
    findUserFollowedBroadcasters = (userid: string) => this.repository.findUserFollowedBroadcasters(userid);
}