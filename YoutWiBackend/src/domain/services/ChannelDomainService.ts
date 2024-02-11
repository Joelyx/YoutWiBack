import {inject, injectable} from "inversify";
import {IChannelRepository} from "../port/secondary/IChannelRepository";
import { Channel } from "../models/Channel";
import {Types} from "../../infrastructure/config/Types";


@injectable()
export class ChannelDomainService implements IChannelRepository {
    constructor(@inject(Types.IChannelRepository) private repository: IChannelRepository) {}


    async saveChannels(channels: Channel[]): Promise<void> {
        await this.repository.saveChannels(channels);
    }

    async saveSubscribed(userid: string, channels: Channel[]): Promise<void> {
        await this.repository.saveSubscribed(userid, channels);
    }
}
