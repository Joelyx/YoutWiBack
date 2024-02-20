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
exports.BroadcasterDatabaseService = void 0;
const inversify_1 = require("inversify");
const Broadcaster_1 = require("../../../../domain/models/Broadcaster");
const Neo4jDataSource_1 = require("../../../config/Neo4jDataSource");
let BroadcasterDatabaseService = class BroadcasterDatabaseService {
    saveBroadcasters(broadcasters) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const broadcaster of broadcasters) {
                const query = `MERGE (b:Broadcaster { id: $broadcasterId }) ON CREATE SET
                 b.name = $broadcasterName
                `;
                const parameters = {
                    broadcasterId: broadcaster.id,
                    broadcasterName: broadcaster.name,
                };
                //console.log('Saving broadcaster:', parameters);
                yield (0, Neo4jDataSource_1.executeQuery)(query, parameters);
            }
        });
    }
    saveFollowed(userid, broadcasters) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const broadcaster of broadcasters) {
                const query = `MATCH (u:User {id: $userId})
                MERGE (b:Broadcaster {id: $broadcasterId})   
                ON CREATE SET b.name = $broadcasterName
                MERGE (u)-[:FOLLOWED]->(b)`;
                const parameters = {
                    userId: userid,
                    broadcasterId: broadcaster.id,
                    broadcasterName: broadcaster.name,
                };
                //console.log('Saving followed broadcaster:', parameters);
                yield (0, Neo4jDataSource_1.executeQuery)(query, parameters);
            }
        });
    }
    findUserFollowedBroadcasters(userid) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            MATCH (u:User {id: $userId})-[:FOLLOWED]->(b:Broadcaster)
            RETURN b.id as id, b.name as name
        `;
            const result = yield (0, Neo4jDataSource_1.executeQuery)(query, { userId: userid });
            const broadcasters = result.map((record) => {
                let broadcaster = new Broadcaster_1.Broadcaster();
                broadcaster.id = record.get('id');
                broadcaster.name = record.get('name');
                return broadcaster;
            });
            return broadcasters;
        });
    }
};
exports.BroadcasterDatabaseService = BroadcasterDatabaseService;
exports.BroadcasterDatabaseService = BroadcasterDatabaseService = __decorate([
    (0, inversify_1.injectable)()
], BroadcasterDatabaseService);
