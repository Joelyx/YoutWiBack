

export interface IBroadcasterDomainService {
    saveBroadcasters(broadcasters: any[]): Promise<void>;
    saveFollowed(userid: string, broadcasters: any[]): Promise<void>;
    findUserFollowedBroadcasters(userid: string): Promise<any[]>;
}