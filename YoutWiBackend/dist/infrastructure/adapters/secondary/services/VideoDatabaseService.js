"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoDatabaseService = void 0;
const Video_1 = require("../../../../domain/models/Video");
const Neo4jDataSource_1 = require("../../../config/Neo4jDataSource");
const inversify_1 = require("inversify");
const Channel_1 = require("../../../../domain/models/Channel");
let VideoDatabaseService = class VideoDatabaseService {
    saveLikedVideosForUser(userId, videos) {
        return __awaiter(this, void 0, void 0, function* () {
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
                yield (0, Neo4jDataSource_1.executeQuery)(query, parameters);
                //console.log(newVar, video.id, video.title, video.updatedAt, userId);
            }
            console.log('Videos saved successfully');
        });
    }
    saveVideos(videos) {
        return __awaiter(this, void 0, void 0, function* () {
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
                yield (0, Neo4jDataSource_1.executeQuery)(query, parameters);
                //console.log(newVar, video.id, video.title, video.updatedAt, userId);
            }
            console.log('Videos saved successfully');
        });
    }
    findVideosForUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            MATCH (u:User {id: $userId})-[:SUBSCRIBED]->(c:Channel)<-[:BELONGS_TO]-(v:Video)
            WHERE NOT (u)-[:WATCHED]->(v)
            OPTIONAL MATCH (v)<-[:LIKED]-(:User)
            WITH v, c, COUNT(*) AS likes
            ORDER BY v.createdAt ASC, likes ASC
            RETURN v, likes
        `;
            const parameters = {
                userId
            };
            const result = yield (0, Neo4jDataSource_1.executeQuery)(query, parameters);
            let videos = result.map((record) => {
                let video = new Video_1.Video();
                video = record.get('v');
                return video;
            });
            console.log("aja" + JSON.stringify(videos));
            return videos;
        });
    }
    findById(videoId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
        MATCH (v:Video {id: $videoId})
        MATCH (v)-[:BELONGS_TO]->(c:Channel)
        RETURN v.id as id, v.title as title, v.createdAt as createdAt, v.updatedAt as updatedAt, 
               c.id as channelId, c.title as channelTitle, c.image as channelImage
    `;
            const parameters = { videoId };
            const result = yield (0, Neo4jDataSource_1.executeQuery)(query, parameters);
            if (result.length > 0) {
                let video = new Video_1.Video();
                video.channel = new Channel_1.Channel();
                video.id = result[0].get('id');
                video.title = result[0].get('title');
                video.createdAt = result[0].get('createdAt');
                video.updatedAt = result[0].get('updatedAt');
                video.channel.id = result[0].get('channelId');
                video.channel.title = result[0].get('channelTitle');
                video.channel.image = result[0].get('channelImage');
                console.log("video" + JSON.stringify(video));
                return video;
            }
            else {
                return null;
            }
        });
    }
};
exports.VideoDatabaseService = VideoDatabaseService;
exports.VideoDatabaseService = VideoDatabaseService = __decorate([
    (0, inversify_1.injectable)()
], VideoDatabaseService);
