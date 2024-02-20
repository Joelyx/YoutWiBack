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
exports.ChannelDatabaseService = void 0;
const inversify_1 = require("inversify");
const Channel_1 = require("../../../../domain/models/Channel");
const Neo4jDataSource_1 = require("../../../config/Neo4jDataSource");
let ChannelDatabaseService = class ChannelDatabaseService {
    saveChannels(channels) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const channel of channels) {
                const query = 'MERGE (c:Channel { id: $channelId }) ON CREATE SET' +
                    '  c.title = $channelTitle,  c.channelDescription = $channelDescription';
                const parameters = {
                    channelId: channel.id,
                    channelTitle: channel.title,
                    channelDescription: channel.description,
                };
                //console.log('Saving channel:', parameters);
                yield (0, Neo4jDataSource_1.executeQuery)(query, parameters);
            }
            //console.log('Channel saved successfully');
        });
    }
    saveSubscribed(userid, channels) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            for (const channel of channels) {
                const query = `MATCH (u:User {id: $userId})
                MERGE (c:Channel {id: $channelId})   
                ON CREATE SET c.title = $channelTitle, c.channelDescription = $channelDescription 
                MERGE (u)-[:SUBSCRIBED]->(c)`;
                const parameters = {
                    userId: userid,
                    channelId: channel.id,
                    channelTitle: channel.title,
                    channelDescription: (_a = channel.description) !== null && _a !== void 0 ? _a : '',
                };
                //console.log('Saving subscribed channel:', parameters);
                yield (0, Neo4jDataSource_1.executeQuery)(query, parameters);
            }
        });
    }
    // funcion qe busca los canales que llevan más tiempo sin actualizarse
    findChannelsWithoutUpdate() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            MATCH (c:Channel)
            WHERE NOT (c)-[:BELONGS_TO]->(:Video)
            RETURN c.id as id, c.title as title, c.channelDescription as description, c.updatedAt as updatedAt
        `;
            const result = yield (0, Neo4jDataSource_1.executeQuery)(query);
            return result.map(record => {
                var _a;
                let channel = new Channel_1.Channel();
                channel.id = record.get('id');
                channel.title = record.get('title');
                channel.description = record.get('description');
                channel.updatedAt = (_a = record.get('updatedAt')) !== null && _a !== void 0 ? _a : null;
                return channel;
            });
        });
    }
};
exports.ChannelDatabaseService = ChannelDatabaseService;
exports.ChannelDatabaseService = ChannelDatabaseService = __decorate([
    (0, inversify_1.injectable)()
], ChannelDatabaseService);
