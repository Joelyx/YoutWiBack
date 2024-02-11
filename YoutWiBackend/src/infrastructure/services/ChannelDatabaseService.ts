import {injectable} from "inversify";
import {IChannelRepository} from "../../domain/port/secondary/IChannelRepository";
import { Channel } from "../../domain/models/Channel";
import {executeQuery} from "../config/Neo4jDataSource";


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

}