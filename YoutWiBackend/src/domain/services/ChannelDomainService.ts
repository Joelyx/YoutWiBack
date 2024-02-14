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
        // Filtrar los canales que llevan más de 1 semana sin actualizarse o que su fecha de actualización sea null
        channels = channels.filter(channel => {
            if (channel.updatedAt === null) {
                return true;
            }
            // Asegúrate de que updatedAt es un objeto Date
            const updatedAt = new Date(channel.updatedAt);
            const now = new Date();
            const diff = now.getTime() - updatedAt.getTime();
            const days = diff / (1000 * 60 * 60 * 24);
            return days > 7;
        });
        // Cogemos los primeros 15 canales
        channels = channels.slice(0, 15);

        return channels;
    }

    async findChannel(channelId: String): Promise<Channel> {
        return await this.repository.findChannel(channelId);
    }

}
