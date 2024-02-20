import {Channel} from "../../models/Channel";


export interface IChannelDomainService{
    saveChannels(channels: Channel[]): Promise<void>;
    saveSubscribed(userid: string, channels: Channel[]): Promise<void>;
    findChannelsWithoutUpdate(): Promise<Channel[]>;
    findChannel(channelId: String): Promise<Channel>;

}