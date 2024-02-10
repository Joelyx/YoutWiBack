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
const Neo4jDataSource_1 = require("../config/Neo4jDataSource");
const inversify_1 = require("inversify");
let VideoDatabaseService = class VideoDatabaseService {
    saveLikedVideosForUser(userId, videos) {
        return __awaiter(this, void 0, void 0, function* () {
            // Utiliza executeQuery en lugar de driver.session() directamente
            for (const video of videos) {
                const query = `
                MATCH (u:User {id: $userId})
                MERGE (v:Video {id: $videoId})
                ON CREATE SET v.title = $title, v.createdAt = $createdAt
                MERGE (u)-[:LIKED]->(v)
            `;
                const parameters = {
                    userId,
                    videoId: video.id,
                    title: video.title,
                    createdAt: video.updatedAt,
                };
                //console.log(JSON.stringify(videos), userId);
                // Ejecuta la consulta utilizando la función executeQuery
                let newVar = yield (0, Neo4jDataSource_1.executeQuery)(query, parameters);
                console.log(newVar, video.id, video.title, video.updatedAt, userId);
            }
            console.log('Videos saved successfully');
        });
    }
};
exports.VideoDatabaseService = VideoDatabaseService;
exports.VideoDatabaseService = VideoDatabaseService = __decorate([
    (0, inversify_1.injectable)()
], VideoDatabaseService);
