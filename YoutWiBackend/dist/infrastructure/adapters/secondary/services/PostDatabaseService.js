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
const User_1 = require("../../../../domain/models/User");
const Video_1 = require("../../../../domain/models/Video");
const uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
const user = process.env.NEO4J_USER || 'neo4j';
const password = process.env.NEO4J_PASSWORD || 'q1w2q2w1';
const driver = neo4j_driver_1.default.driver(uri, neo4j_driver_1.default.auth.basic(user, password));
let PostDatabaseService = class PostDatabaseService {
    savePost(post) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const session = driver.session();
            const query = `
        MATCH (u:User {id: $userId})
        MATCH (v:Video {id: $videoId})
        CREATE (p:Post {id: apoc.create.uuid(), content: $content, createdAt: $createdAt, likes: $likes})
        MERGE (u)-[:PUBLISHED]->(p)
        MERGE (p)-[:HAS_VIDEO]->(v)
        RETURN p.id AS postId
    `;
            const queryComments = `
        MATCH (p:Post {id: $postId}), (u:User {id: $userId})
        CREATE (c:Comment {id: apoc.create.uuid(), content: $content, createdAt: $createdAt})
        MERGE (u)-[:COMMENTED]->(c)
        MERGE (c)-[:BELONGS_TO]->(p)
    `;
            const txc = session.beginTransaction();
            try {
                const parameters = {
                    userId: post.user.getId,
                    videoId: post.video.id,
                    likes: (_a = post.likes) !== null && _a !== void 0 ? _a : 0,
                    content: post.content,
                    createdAt: post.createdAt.toISOString()
                };
                let postResult = yield txc.run(query, parameters);
                const postId = postResult.records[0].get('postId');
                if (post.comments != null && post.comments.length != 0) {
                    let comments = post.comments;
                    for (const comment of comments) {
                        const commentParameters = {
                            userId: comment.user.getId,
                            postId: postId, // Usar el ID del Post generado
                            content: comment.content,
                            createdAt: comment.createdAt.toISOString()
                        };
                        yield txc.run(queryComments, commentParameters);
                    }
                }
                yield txc.commit();
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
            MATCH (p)-[:HAS_VIDEO]->(v:Video)
            RETURN p.id as id, p.content as content, p.createdAt as createdAt, u.id as userId, u.name as userName, v.id as videoId, v.title as videoTitle, p.likes as likes
        `;
            const session = driver.session();
            const result = yield session.run(query, { postId });
            const record = result.records[0];
            const post = new Post_1.Post();
            post.id = record.get('id');
            post.content = record.get('content');
            post.createdAt = record.get('createdAt');
            post.user = new User_1.User();
            post.user.setId = record.get('userId');
            post.user.setUsername = record.get('userName');
            post.video = new Video_1.Video();
            post.video.id = record.get('videoId');
            post.video.title = record.get('videoTitle');
            post.likes = record.get('likes');
            yield session.close();
            return post;
        });
    }
    findPostComments(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
        MATCH (p:Post {id: $postId})<-[:COMMENTED_ON]-(c:Comment)<-[:COMMENTED]-(u:User)
        RETURN c.id AS commentId, c.content AS content, c.createdAt AS createdAt, 
               u.id AS userId, u.name AS username
        ORDER BY c.createdAt DESC
    `;
            const session = driver.session();
            let comments = [];
            try {
                const result = yield session.run(query, { postId });
                comments = result.records.map(record => {
                    const comment = new Comment_1.Comment();
                    comment.id = record.get('commentId');
                    comment.content = record.get('content');
                    comment.createdAt = new Date(record.get('createdAt'));
                    const user = new User_1.User();
                    user.setId = record.get('userId');
                    user.setUsername = record.get('username');
                    comment.user = user;
                    return comment;
                });
            }
            catch (error) {
                console.error('Error al buscar comentarios del post', error);
            }
            finally {
                yield session.close();
            }
            return comments;
        });
    }
    findPostsWithLimitAndOffset(limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            MATCH (p:Post)
            MATCH (u:User)-[:PUBLISHED]->(p)
            MATCH (p)-[:HAS_VIDEO]->(v:Video)
            RETURN p.id as id, p.content as content, p.createdAt as createdAt, u.id as userId, u.name as userName, v.id as videoId, v.title as videoTitle, p.likes as likes
            ORDER BY p.createdAt DESC
            SKIP toInteger($offset) LIMIT toInteger($limit)
        `;
            const session = driver.session();
            const result = yield session.run(query, { limit, offset });
            const posts = result.records.map(record => {
                const post = new Post_1.Post();
                post.id = record.get('id');
                post.content = record.get('content');
                post.createdAt = record.get('createdAt');
                post.user = new User_1.User();
                post.user.setId = record.get('userId');
                post.user.setUsername = record.get('userName');
                post.video = new Video_1.Video();
                post.video.id = record.get('videoId');
                post.video.title = record.get('videoTitle');
                post.likes = record.get('likes');
                return post;
            });
            yield session.close();
            return posts;
        });
    }
    savePostComment(postId, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = driver.session();
            const query = `
        MATCH (p:Post {id: $postId})
        MATCH (u:User {id: $userId})
        CREATE (c:Comment {id: randomUUID(), content: $content, createdAt: $createdAt})
        MERGE (u)-[:COMMENTED]->(c)
        MERGE (c)-[:COMMENTED_ON]->(p)
    `;
            try {
                const parameters = {
                    postId: postId,
                    userId: comment.user.getId.toString(),
                    content: comment.content,
                    createdAt: new Date().toISOString()
                };
                yield session.run(query, parameters);
                console.log(parameters);
            }
            catch (error) {
                console.error('Error en la transacción', error);
            }
            finally {
                yield session.close();
            }
        });
    }
    likePost(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = driver.session();
            try {
                const parameters = { postId, userId };
                // Verificar si ya existe un like del usuario al post
                const resultCheck = yield session.run(`
            MATCH (u:User {id: $userId})-[r:POST_LIKED]->(p:Post {id: $postId})
            RETURN r
        `, parameters);
                if (resultCheck.records.length > 0) {
                    // Si ya existe un like, quitar el like y decrementar los likes del post
                    yield session.run(`
                MATCH (u:User {id: $userId})-[r:POST_LIKED]->(p:Post {id: $postId})
                SET p.likes = p.likes - 1
                DELETE r
            `, parameters);
                    return -1;
                }
                else {
                    // Si no existe el like, crear el like y incrementar los likes del post
                    yield session.run(`
                MATCH (u:User {id: $userId}), (p:Post {id: $postId})
                MERGE (u)-[r:POST_LIKED]->(p)
                ON CREATE SET p.likes = coalesce(p.likes, 0) + 1
            `, parameters);
                    return 1;
                }
            }
            catch (error) {
                console.error('Error al manejar el like', error);
            }
            finally {
                yield session.close();
            }
            return 0; // En caso de error, retornar 0
        });
    }
};
exports.PostDatabaseService = PostDatabaseService;
exports.PostDatabaseService = PostDatabaseService = __decorate([
    (0, inversify_1.injectable)()
], PostDatabaseService);
