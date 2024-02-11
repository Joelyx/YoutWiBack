import {injectable} from "inversify";
import {IChannelRepository} from "../../domain/port/secondary/IChannelRepository";
import { Channel } from "../../domain/models/Channel";
import {executeQuery} from "../config/Neo4jDataSource";


@injectable()
export class ChannelDatabaseService implements IChannelRepository {
    async saveChannels(channels: Channel[]): Promise<void> {
        for (const channel of channels) {
            const query =
                'CREATE (:Channel ' +
                '{ id: $channelId, title: $channelTitle, ' +
                'channelDescription: $channelDescription })';
            const parameters = {
                channelId: channel.id,
                channelTitle: channel.title,
                channelDescription: channel.description,
            };

            //console.log('Saving channel:', parameters);

            await executeQuery(query, parameters);
        }
        //console.log('Channel saved successfully');
    }

}