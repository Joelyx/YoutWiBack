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

            //console.log('Saving followed broadcaster:', parameters);

            await executeQuery(query, parameters);
        }
    }
    async findUserFollowedBroadcasters(userid: string): Promise<Broadcaster[]> {
        const query = `
            MATCH (u:User {id: $userId})-[:FOLLOWED]->(b:Broadcaster)
            RETURN b.id as id, b.name as name
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