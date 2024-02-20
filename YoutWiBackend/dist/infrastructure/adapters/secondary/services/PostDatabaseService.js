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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostDatabaseService = void 0;
const inversify_1 = require("inversify");
const Post_1 = require("../../../../domain/models/Post");
const neo4j_driver_1 = __importDefault(require("neo4j-driver"));
const Comment_1 = require("../../../../domain/models/Comment");
const uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
const user = process.env.NEO4J_USER || 'neo4j';
const password = process.env.NEO4J_PASSWORD || 'q1w2q2w1';
const driver = neo4j_driver_1.default.driver(uri, neo4j_driver_1.default.auth.basic(user, password));
let PostDatabaseService = class PostDatabaseService {
    savePost(post) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = driver.session();
            const query = `
            MATCH (u:User {id: $userId})
            MATCH (v:Video {id: $videoId})
            MERGE (p:Post {id: $postId})
            ON CREATE SET p.content = $content, p.createdAt = $createdAt
            MERGE (u)-[:PUBLISHED]->(p)
            MERGE (p)-[:HAS_VIDEO]->(v)
        `;
            const queryComments = `
            MATCH (p:Post {id: $postId})
            MERGE (c:Comment {id: $commentId})
            ON CREATE SET c.content = $content, c.createdAt = $createdAt
            MERGE (u)-[:COMMENTED]->(c)
            MERGE (c)-[:BELONGS_TO]->(p)
        `;
            const txc = session.beginTransaction();
            try {
                const parameters = {
                    userId: post.user.getId,
                    videoId: post.video.id,
                    postId: post.id,
                    content: post.content,
                    createdAt: post.createdAt
                };
                yield txc.run(query, parameters);
                let comments = post.comments;
                for (const comment of comments) {
                    const parameters = {
                        userId: comment.user.getId,
                        commentId: comment.id,
                        postId: post.id,
                        content: comment.content,
                        createdAt: comment.createdAt
                    };
                    yield txc.run(queryComments, parameters);
                }
                yield txc.commit();
                console.log('Transacción confirmada');
            }
            catch (error) {
                console.error('Error en la transacción', error);
                yield txc.rollback();
            }
            finally {
                yield session.close();
            }
        });
    }
    findPost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            MATCH (p:Post {id: $postId})
            MATCH (u:User)-[:PUBLISHED]->(p)
            MATCH (v:Video)-[:HAS_VIDEO]->(p)
            RETURN p.id as id, p.content as content, p.createdAt as createdAt, u.id as userId, u.name as userName, v.id as videoId
        `;
            const session = driver.session();
            const result = yield session.run(query, { postId });
            const record = result.records[0];
            const post = new Post_1.Post();
            post.id = record.get('id');
            post.content = record.get('content');
            post.createdAt = record.get('createdAt');
            post.user.setId = record.get('userId');
            post.user.setUsername = record.get('userName');
            post.video = record.get('videoId');
            yield session.close();
            return post;
        });
    }
    findPostComments(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            MATCH (p:Post {id: $postId})-[:BELONGS_TO]->(c:Comment)
            MATCH (u:User)-[:COMMENTED]->(c)
            RETURN c.id as id, c.content as content, c.createdAt as createdAt, u.id as userId, u.name as userName
        `;
            const session = driver.session();
            const result = yield session.run(query, { postId });
            const comments = result.records.map(record => {
                const comment = new Comment_1.Comment();
                comment.id = record.get('id');
                comment.content = record.get('content');
                comment.createdAt = record.get('createdAt');
                comment.user.setId = record.get('userId');
                comment.user.setUsername = record.get('userName');
                return comment;
            });
            yield session.close();
            return comments;
        });
    }
    findPostsWithLimitAndOffset(limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            MATCH (p:Post)
            MATCH (u:User)-[:PUBLISHED]->(p)
            MATCH (v:Video)-[:HAS_VIDEO]->(p)
            RETURN p.id as id, p.content as content, p.createdAt as createdAt, u.id as userId, u.name as userName, v.id as videoId
            ORDER BY p.createdAt DESC
            SKIP $offset LIMIT $limit
        `;
            const session = driver.session();
            const result = yield session.run(query, { limit, offset });
            const posts = result.records.map(record => {
                const post = new Post_1.Post();
                post.id = record.get('id');
                post.content = record.get('content');
                post.createdAt = record.get('createdAt');
                post.user.setId = record.get('userId');
                post.user.setUsername = record.get('userName');
                post.video = record.get('videoId');
                return post;
            });
            yield session.close();
            return posts;
        });
    }
};
exports.PostDatabaseService = PostDatabaseService;
exports.PostDatabaseService = PostDatabaseService = __decorate([
    (0, inversify_1.injectable)()
], PostDatabaseService);
