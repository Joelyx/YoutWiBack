import {IVideoRepository} from "../../../../domain/port/secondary/IVideoRepository";
import {Video} from "../../../../domain/models/Video";
import {executeQuery} from "../../../config/Neo4jDataSource";
import {injectable} from "inversify";


@injectable()
export class VideoDatabaseService implements IVideoRepository {
    async saveLikedVideosForUser(userId: string, videos: Video[]): Promise<void> {
        // Utiliza executeQuery en lugar de driver.session() directamente
        for (const video of videos) {
            const query = `
                MATCH (u:User {id: $userId})
                MATCH (c:Channel {id: $channelId})
                MERGE (v:Video {id: $videoId})
                ON CREATE SET v.title = $title, v.createdAt = $createdAt
                MERGE (u)-[:LIKED]->(v)
                MERGE (u)-[:WATCHED]->(v) 
                MERGE (v)-[:BELONGS_TO]->(c)
            `;
            const parameters = {
                userId,
                videoId: video.id,
                title: video.title,
                createdAt: video.updatedAt,
                channelId: video.channel.id
            };
            //console.log(JSON.stringify(videos), userId);

            // Ejecuta la consulta utilizando la función executeQuery
            await executeQuery(query, parameters);
            //console.log(newVar, video.id, video.title, video.updatedAt, userId);

        }
        console.log('Videos saved successfully');
    }

    async saveVideos(videos: Video[]): Promise<void> {
        for (const video of videos) {
            const query = `
                MATCH (c:Channel {id: $channelId})
                MERGE (v:Video {id: $videoId})
                ON CREATE SET v.title = $title, v.createdAt = $createdAt, c.updatedAt = $updatedAt
                MERGE (v)-[:BELONGS_TO]->(c)
            `;
            const parameters = {
                videoId: video.id,
                title: video.title,
                createdAt: video.updatedAt,
                updatedAt: new Date().toTimeString(),
                channelId: video.channel.id
            };
            //console.log(JSON.stringify(videos), userId);

            // Ejecuta la consulta utilizando la función executeQuery
            await executeQuery(query, parameters);
            //console.log(newVar, video.id, video.title, video.updatedAt, userId);

        }
        console.log('Videos saved successfully');
    }

    async findVideosForUser(userId: string): Promise<Video[]> {
        const query = `
            MATCH (u:User {id: $userId})-[:SUBSCRIBED]->(c:Channel)<-[:BELONGS_TO]-(v:Video)
            WHERE NOT (u)-[:WATCHED]->(v)
            RETURN v
        `;
        const parameters = {
            userId
        };
        const result = await executeQuery(query, parameters);
        let videos = result.map(record => {
            let video = new Video();
            video = record.get('v');
            return video
        });
        console.log("aja"+JSON.stringify(videos));
        return videos;
    }
}