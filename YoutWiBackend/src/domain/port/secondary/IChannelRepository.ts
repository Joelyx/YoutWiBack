import {Channel} from "../../models/Channel";


export interface  IChannelRepository {
    saveChannels(channels: Channel[]): Promise<void>;
    saveSubscribed(userid: string, channels: Channel[]): Promise<void>;
}