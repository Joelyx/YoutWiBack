import {injectable} from "inversify";
import {IChannelRepository} from "../../../../domain/port/secondary/IChannelRepository";
import { Channel } from "../../../../domain/models/Channel";
import {executeQuery} from "../../../config/Neo4jDataSource";


@injectable()
export class ChannelDatabaseService implements IChannelRepository {
    async saveChannels(channels: Channel[]): Promise<void> {
        for (const channel of channels) {
            const query = 'MERGE (c:Channel { id: $channelId }) ON CREATE SET' +
                '  c.title = $channelTitle,  c.channelDescription = $channelDescription, c.subscribers = $channelSubscribers, c.image = $channelImage'
            const parameters = {
                channelId: channel.id,
                channelTitle: channel.title,
                channelDescription: channel.description,
                channelSubscribers: channel.subscribers,
                channelImage: channel.image
            };

            //console.log('Saving channel:', parameters);

            await executeQuery(query, parameters);
        }
        //console.log('Channel saved successfully');
    }

    async saveSubscribed(userid: string, channels: Channel[]): Promise<void> {
        for (const channel of channels) {
            const query =
                `MATCH (u:User {id: $userId})
                MERGE (c:Channel {id: $channelId})   
                ON CREATE SET c.title = $channelTitle, c.channelDescription = $channelDescription, c.subscribers = $channelSubscribers, c.image = $channelImage
                MERGE (u)-[:SUBSCRIBED]->(c)`
            const parameters = {
                userId: userid,
                channelId: channel.id,
                channelTitle: channel.title,
                channelDescription: channel.description ?? '',
                channelImage: channel.image ?? '',
                channelSubscribers: channel.subscribers ?? 0
            };

            //console.log('Saving subscribed channel:', parameters);

            await executeQuery(query, parameters);
        }
        //console.log('Subscribed channel saved successfully');
    }

    // funcion qe busca los canales que llevan más tiempo sin actualizarse
    async findChannelsWithoutUpdate(): Promise<Channel[]> {
        const query = `
            MATCH (c:Channel)
            WHERE NOT (c)-[:BELONGS_TO]->(:Video)
            RETURN c.id as id, c.title as title, c.channelDescription as description, c.updatedAt as updatedAt, c.subscribers as subscribers, c.image as image
        `;
        const result = await executeQuery(query);
        return result.map((record: { get: (arg0: string) => any; }) => {
            let channel = new Channel();
            channel.id = record.get('id');
            channel.title = record.get('title');
            channel.description = record.get('description');
            channel.updatedAt = record.get('updatedAt') ?? null;
            channel.subscribers = record.get('subscribers') ?? 0;
            channel.image = record.get('image') ?? '';
            return channel
        });
    }

    async findChannel(channelId: string): Promise<Channel> {
        const query = `
            MATCH (c:Channel {id: $channelId})
            RETURN c.id as id, c.title as title, c.channelDescription as description, c.updatedAt as updatedAt, c.subscribers as subscribers, c.image as image
        `;
        const parameters = {
            channelId
        };
        const result = await executeQuery(query, parameters);
        let channel = new Channel();
        channel.id = result[0].get('id');
        channel.title = result[0].get('title');
        channel.description = result[0].get('description');
        channel.updatedAt = result[0].get('updatedAt') ?? null;
        channel.subscribers = result[0].get('subscribers') ?? 0;
        channel.image = result[0].get('image') ?? '';
        return channel;
    }

}