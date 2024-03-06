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
            WITH u, COLLECT(b) AS userFollowedBroadcasters
            OPTIONAL MATCH (u)-[:FOLLOWS]->(f:User)
            OPTIONAL MATCH (f)-[:FOLLOWED]->(b:Broadcaster)
            WHERE NOT b IN userFollowedBroadcasters
            WITH u, userFollowedBroadcasters, COLLECT(DISTINCT b) AS friendFollowedBroadcasters
            OPTIONAL MATCH (b:Broadcaster)
            WHERE NOT b IN userFollowedBroadcasters AND NOT b IN friendFollowedBroadcasters
            WITH b, [(b)<-[:FOLLOWED]-() | 1] AS followers, userFollowedBroadcasters, friendFollowedBroadcasters
            WITH b, SIZE(followers) AS totalFollowers, userFollowedBroadcasters, friendFollowedBroadcasters
            ORDER BY totalFollowers DESC
            LIMIT 10
            WITH COLLECT(b) AS popularBroadcasters, userFollowedBroadcasters, friendFollowedBroadcasters
            RETURN CASE
                WHEN SIZE(userFollowedBroadcasters) > 0 THEN userFollowedBroadcasters + friendFollowedBroadcasters + popularBroadcasters
                WHEN SIZE(friendFollowedBroadcasters) > 0 THEN friendFollowedBroadcasters + popularBroadcasters
                ELSE popularBroadcasters
            END AS recommendedBroadcasters

        `;
        const result = await executeQuery(query, {userId: userid});
        const broadcasters = result.map((record: { get: (arg0: string) => string; }) => {
            let broadcaster = new Broadcaster();
            broadcaster.id = record.get('id');
            broadcaster.name = record.get('name');
            return broadcaster;
        });
        return broadcasters;
    }

}