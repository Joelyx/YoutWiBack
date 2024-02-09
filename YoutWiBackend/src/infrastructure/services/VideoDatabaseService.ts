import {IVideoRepository} from "../../domain/port/secondary/IVideoRepository";
import {Video} from "../../domain/models/Video";
import {executeQuery} from "../config/Neo4jDataSource";
import {injectable} from "inversify";


@injectable()
export class Neo4jVideoRepository implements IVideoRepository {
    async saveLikedVideosForUser(userId: string, videos: Video[]): Promise<void> {
        // Utiliza executeQuery en lugar de driver.session() directamente
        for (const video of videos) {
            const query = `
                MATCH (u:User {id: $userId})
                MERGE (v:Video {id: $videoId})
                ON CREATE SET v.title = $title, v.channel = $channel, v.createdAt = $createdAt
                MERGE (u)-[:LIKED]->(v)
            `;
            const parameters = {
                userId,
                videoId: video.getId,
                title: video.getTitle,
                channel: video.getChannel,
                createdAt: video.getCreatedAt.toISOString(),
            };

            // Ejecuta la consulta utilizando la función executeQuery
            await executeQuery(query, parameters);
        }
    }
}