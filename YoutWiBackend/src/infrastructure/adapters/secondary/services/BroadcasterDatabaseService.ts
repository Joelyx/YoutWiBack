import {injectable} from "inversify";
import {IBroadcasterRepository} from "../../../../domain/port/secondary/IBroadcasterRepository";
import { Broadcaster } from "../../../../domain/models/Broadcaster";
import {executeQuery} from "../../../config/Neo4jDataSource";


@injectable()
export class BroadcasterDatabaseService implements IBroadcasterRepository {
    async saveBroadcasters(broadcasters: Broadcaster[]): Promise<void> {
        for (const broadcaster of broadcasters) {
            const query = `MERGE (b:Broadcaster { id: $broadcasterId }) ON CREATE SET
                 b.name = $broadcasterName
                `
            const parameters = {
                broadcasterId: broadcaster.id,
                broadcasterName: broadcaster.name,
            };

            //console.log('Saving broadcaster:', parameters);

            await executeQuery(query, parameters);

        }
    }

    async saveFollowed(userid: string, broadcasters: Broadcaster[]): Promise<void> {
        for (const broadcaster of broadcasters) {
            const query =
                `MATCH (u:User {id: $userId})
                MERGE (b:Broadcaster {id: $broadcasterId})   
                ON CREATE SET b.name = $broadcasterName
                MERGE (u)-[:FOLLOWED]->(b)`
            const parameters = {
                userId: userid,
                broadcasterId: broadcaster.id,
                broadcasterName: broadcaster.name,
            };

            await executeQuery(query, parameters);
            console.log('Followed broadcaster saved successfully');
        }
    }
    async findUserFollowedBroadcasters(userid: string): Promise<Broadcaster[]> {
        const query = `
        MATCH (u:User {id: $userId})
        OPTIONAL MATCH (u)-[:FOLLOWED]->(b:Broadcaster)
        OPTIONAL MATCH (u)-[:FOLLOWS]->(f)
        OPTIONAL MATCH (f)-[:FOLLOWED]->(bf:Broadcaster)
        WITH b, bf, CASE WHEN SIZE(COLLECT(bf)) > 0 THEN COLLECT(bf) ELSE [] END AS bfList
        RETURN b, bfList
  `;

        const result = await executeQuery(query, { userId: userid });

        const broadcasters: Broadcaster[] = [];

        if (result.length > 0) {
            const recommendedBroadcasters = result[0].get('recommendedBroadcasters');

            recommendedBroadcasters.forEach((broadcasterNode: any) => {
                const broadcaster = new Broadcaster();
                broadcaster.id = broadcasterNode.properties.id;
                broadcaster.name = broadcasterNode.properties.name;
                broadcasters.push(broadcaster);
            });
        }

        return broadcasters;
    }


}