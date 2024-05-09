import {IVideoRepository} from "../../../../domain/port/secondary/IVideoRepository";
import {Video} from "../../../../domain/models/Video";
import {executeQuery} from "../../../config/Neo4jDataSource";
import {injectable} from "inversify";
import {Channel} from "../../../../domain/models/Channel";


@injectable()
export class VideoDatabaseService implements IVideoRepository {
    async saveLikedVideosForUser(userIdIn: string, videos: Video[]): Promise<void> {
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
            const userId = Number(userIdIn);
            const parameters = {
                userId,
                videoId: video.id,
                title: video.title,
                createdAt: video.updatedAt,
                channelId: video.channel.id
            };

            await executeQuery(query, parameters);

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
        //console.log('Videos saved successfully');
    }

    async findVideosForUser(userIdIn: string): Promise<Video[]> {
        const query = `
        MATCH (u:User {id: $userId})-[:SUBSCRIBED]->(c:Channel)<-[:BELONGS_TO]-(v:Video)
        WHERE NOT (u)-[:WATCHED]->(v)
        OPTIONAL MATCH (v)<-[:LIKED]-(:User)
        WITH v, COUNT(*) AS likes
        OPTIONAL MATCH (v)-[:WATCHED]->(:User)
        WITH v, likes, COUNT(*) AS watched
        ORDER BY v.createdAt DESC, likes DESC, watched DESC
        RETURN v AS video, likes, watched LIMIT 100
        UNION
        MATCH (u:User {id: $userId}), (v:Video)
        WHERE NOT (u)-[:WATCHED]->(v)
        OPTIONAL MATCH (v)<-[:LIKED]-(:User)
        WITH v, COUNT(*) AS likes
        ORDER BY likes DESC
        RETURN v AS video, likes, 0 AS watched LIMIT 100
    `;
        const userId = Number(userIdIn);
        const parameters = {
            userId
        };
        const result = await executeQuery(query, parameters);
        let videos = result.map((record: { get: (arg0: string) => Video; }) => {
            let video = new Video();
            video = record.get('video');
            return video;
        });

        for (let i = videos.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [videos[i], videos[j]] = [videos[j], videos[i]];
        }
        return videos;
    }

    async findById(videoId: string): Promise<Video | null> {
        const query = `
        MATCH (v:Video {id: $videoId})
        MATCH (v)-[:BELONGS_TO]->(c:Channel)
        RETURN v.id as id, v.title as title, v.createdAt as createdAt, v.updatedAt as updatedAt, 
               c.id as channelId, c.title as channelTitle, c.image as channelImage
    `;
        const parameters = { videoId };
        const result = await executeQuery(query, parameters);
        if (result.length > 0) {
            let video = new Video();
            video.channel = new Channel();
            video.id = result[0].get('id');
            video.title = result[0].get('title');
            video.createdAt = result[0].get('createdAt');
            video.updatedAt = result[0].get('updatedAt');
            video.channel.id = result[0].get('channelId');
            video.channel.title = result[0].get('channelTitle');
            video.channel.image = result[0].get('channelImage');
            //console.log("video"+JSON.stringify(video));
            return video;
        } else {
            return null;
        }
    }

    async findAllVideos(): Promise<Video[]> {
        const query = `
            MATCH (v:Video)-[:BELONGS_TO]->(c:Channel)
            RETURN v.id as id, v.title as title, v.createdAt as createdAt, v.updatedAt as updatedAt, 
                   c.id as channelId, c.title as channelTitle, c.image as channelImage
            ORDER BY v.updatedAt DESC
        `;
        const result = await executeQuery(query);
        let videos = result.map((record: { get: (key: string) => any }) => {
            let video = new Video();
            video.channel = new Channel();
            video.id = record.get('id');
            video.title = record.get('title');
            video.createdAt = new Date(record.get('createdAt'));
            video.updatedAt = new Date(record.get('updatedAt'));
            video.channel.id = record.get('channelId');
            video.channel.title = record.get('channelTitle');
            video.channel.image = record.get('channelImage');
            return video;
        });
        return videos;
    }

    async saveWatchedVideo(videoId: string, userIdIn: string): Promise<void> {
        const query = `
            MATCH (u:User {id: $userId})
            MATCH (v:Video {id: $videoId})
            MERGE (u)-[:WATCHED]->(v)
        `;
        const userId = Number(userIdIn);
        const parameters = {
            userId,
            videoId
        };
        await executeQuery(query, parameters);
        console.log('Watched video saved successfully');
    }


}