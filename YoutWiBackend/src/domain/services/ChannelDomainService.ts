import {inject, injectable} from "inversify";
import {IChannelRepository} from "../port/secondary/IChannelRepository";
import { Channel } from "../models/Channel";
import {Types} from "../../infrastructure/config/Types";
import {IChannelDomainService} from "../port/primary/IChannelDomainService";


@injectable()
export class ChannelDomainService implements IChannelDomainService {
    constructor(@inject(Types.IChannelRepository) private repository: IChannelRepository) {}


    async saveChannels(channels: Channel[]): Promise<void> {
        await this.repository.saveChannels(channels);
    }

    async saveSubscribed(userid: string, channels: Channel[]): Promise<void> {
        await this.repository.saveSubscribed(userid, channels);
    }

    async findChannelsWithoutUpdate(): Promise<Channel[]> {
        let channels = await this.repository.findChannelsWithoutUpdate();
        // filtrar los canales que llevan más de 1 semana sin actualizarse o que su fecha de actualización sea null
        channels = channels.filter(channel => {
            if (channel.updatedAt === null) {
                return true;
            }
            const now = new Date();
            const diff = now.getTime() - channel.updatedAt.getTime();
            const days = diff / (1000 * 60 * 60 * 24);
            return days > 7;
        });
        // cogemos los primeros 15 canales
        channels = channels.slice(0, 15);

        return channels;
    }
}
