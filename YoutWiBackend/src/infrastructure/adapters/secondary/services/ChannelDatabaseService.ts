import {injectable} from "inversify";
import {IChannelRepository} from "../../../../domain/port/secondary/IChannelRepository";
import { Channel } from "../../../../domain/models/Channel";
import {executeQuery} from "../../../config/Neo4jDataSource";


@injectable()
export class ChannelDatabaseService implements IChannelRepository {
    async saveChannels(channels: Channel[]): Promise<void> {
        for (const channel of channels) {
            const query = 'MERGE (c:Channel { id: $channelId }) ON CREATE SET' +
                '  c.title = $channelTitle,  c.channelDescription = $channelDescription'
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

    async saveSubscribed(userid: string, channels: Channel[]): Promise<void> {
        for (const channel of channels) {
            const query =
                `MATCH (u:User {id: $userId})
                MERGE (c:Channel {id: $channelId})   
                ON CREATE SET c.title = $channelTitle, c.channelDescription = $channelDescription 
                MERGE (u)-[:SUBSCRIBED]->(c)`
            const parameters = {
                userId: userid,
                channelId: channel.id,
                channelTitle: channel.title,
                channelDescription: channel.description ?? '',
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
            RETURN c.id as id, c.title as title, c.channelDescription as description, c.updatedAt as updatedAt
        `;
        const result = await executeQuery(query);
        return result.map(record => {
            let channel = new Channel();
            channel.id = record.get('id');
            channel.title = record.get('title');
            channel.description = record.get('description');
            channel.updatedAt = record.get('updatedAt') ?? null;
            return channel
        });
    }

}