import {inject, injectable} from "inversify";
import {IChannelRepository} from "../port/secondary/IChannelRepository";
import { Channel } from "../models/Channel";
import {TYPES} from "../../infrastructure/config/types";


@injectable()
export class ChannelDomainService implements IChannelRepository {
    constructor(@inject(TYPES.IChannelRepository) private repository: IChannelRepository) {}


    async saveChannels(channels: Channel[]): Promise<void> {
        await this.repository.saveChannels(channels);
    }
}
