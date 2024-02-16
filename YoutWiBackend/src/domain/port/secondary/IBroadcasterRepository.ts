import {Broadcaster} from "../../models/Broadcaster";


export interface IBroadcasterRepository {
    saveBroadcasters(broadcasters: Broadcaster[]): Promise<void>;
    saveFollowed(userid: string, broadcasters: Broadcaster[]): Promise<void>;
    findUserFollowedBroadcasters(userid: string): Promise<Broadcaster[]>;
}