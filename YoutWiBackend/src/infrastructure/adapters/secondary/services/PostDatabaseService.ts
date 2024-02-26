import {injectable} from "inversify";
import {IPostRepository} from "../../../../domain/port/secondary/IPostRepository";
import {Post} from "../../../../domain/models/Post";
import neo4j from "neo4j-driver";
import {Comment} from "../../../../domain/models/Comment";
import {User} from "../../../../domain/models/User";
import {Video} from "../../../../domain/models/Video";
const uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
const user = process.env.NEO4J_USER || 'neo4j';
const password = process.env.NEO4J_PASSWORD || 'q1w2q2w1';

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

@injectable()
export class PostDatabaseService implements IPostRepository {
    public async savePost(post: Post): Promise<void> {
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
                likes: post.likes ?? 0,
                content: post.content,
                createdAt: post.createdAt.toISOString()
            };
            let postResult = await txc.run(query, parameters);
            const postId = postResult.records[0].get('postId');

            if(post.comments != null && post.comments.length != 0){
                let comments = post.comments;
                for (const comment of comments) {
                    const commentParameters = {
                        userId: comment.user.getId,
                        postId: postId, // Usar el ID del Post generado
                        content: comment.content,
                        createdAt: comment.createdAt.toISOString()
                    };
                    await txc.run(queryComments, commentParameters);
                }
            }
            await txc.commit();
        } catch (error) {
            console.error('Error en la transacción', error);
            await txc.rollback();
        } finally {
            await session.close();
        }
    }

    public async findPost(postId: string): Promise<Post> {
        const query = `
            MATCH (p:Post {id: $postId})
            MATCH (u:User)-[:PUBLISHED]->(p)
            MATCH (p)-[:HAS_VIDEO]->(v:Video)
            RETURN p.id as id, p.content as content, p.createdAt as createdAt, u.id as userId, u.name as userName, v.id as videoId, v.title as videoTitle, p.likes as likes
        `;
        const session = driver.session();
        const result = await session.run(query, {postId});
        const record = result.records[0];
        const post = new Post();
        post.id = record.get('id');
        post.content = record.get('content');
        post.createdAt = record.get('createdAt');
        post.user = new User();
        post.user.setId = record.get('userId');
        post.user.setUsername = record.get('userName');
        post.video = new Video();
        post.video.id = record.get('videoId');
        post.video.title = record.get('videoTitle');
        post.likes = record.get('likes');
        await session.close();
        return post;
    }

    public async findPostComments(postId: string): Promise<Comment[]> {
        const query = `
        MATCH (p:Post {id: $postId})<-[:COMMENTED_ON]-(c:Comment)<-[:COMMENTED]-(u:User)
        RETURN c.id AS commentId, c.content AS content, c.createdAt AS createdAt, 
               u.id AS userId, u.name AS username
        ORDER BY c.createdAt DESC
    `;
        const session = driver.session();
        let comments: Comment[] = [];
        try {
            const result = await session.run(query, {postId});
            comments = result.records.map(record => {
                const comment = new Comment();
                comment.id = record.get('commentId');
                comment.content = record.get('content');
                comment.createdAt = new Date(record.get('createdAt'));

                const user = new User();
                user.setId = record.get('userId');
                user.setUsername = record.get('username');

                comment.user = user;

                return comment;
            });
        } catch (error) {
            console.error('Error al buscar comentarios del post', error);
        } finally {
            await session.close();
        }
        return comments;
    }


    async findPostsWithLimitAndOffset(limit: number, offset: number): Promise<Post[]> {
        const query = `
            MATCH (p:Post)
            MATCH (u:User)-[:PUBLISHED]->(p)
            MATCH (p)-[:HAS_VIDEO]->(v:Video)
            RETURN p.id as id, p.content as content, p.createdAt as createdAt, u.id as userId, u.name as userName, v.id as videoId, v.title as videoTitle, p.likes as likes
            ORDER BY p.createdAt DESC
            SKIP toInteger($offset) LIMIT toInteger($limit)
        `;
        const session = driver.session();
        const result = await session.run(query, {limit, offset});
        const posts = result.records.map(record => {
            const post = new Post();
            post.id = record.get('id');
            post.content = record.get('content');
            post.createdAt = record.get('createdAt');
            post.user = new User();
            post.user.setId = record.get('userId');
            post.user.setUsername = record.get('userName');
            post.video = new Video();
            post.video.id = record.get('videoId');
            post.video.title = record.get('videoTitle');
            post.likes = record.get('likes');
            return post;
        });
        await session.close();
        return posts;

    }

    async savePostComment(postId: string, comment: Comment): Promise<void> {
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
            await session.run(query, parameters);
            console.log(parameters);
        } catch (error) {
            console.error('Error en la transacción', error);
        } finally {
            await session.close();
        }
    }

    async likePost(postId: string, userId: string): Promise<number> {
        const session = driver.session();
        try {
            const parameters = { postId, userId };

            // Verificar si ya existe un like del usuario al post
            const resultCheck = await session.run(`
            MATCH (u:User {id: $userId})-[r:POST_LIKED]->(p:Post {id: $postId})
            RETURN r
        `, parameters);

            if (resultCheck.records.length > 0) {
                // Si ya existe un like, quitar el like y decrementar los likes del post
                await session.run(`
                MATCH (u:User {id: $userId})-[r:POST_LIKED]->(p:Post {id: $postId})
                SET p.likes = p.likes - 1
                DELETE r
            `, parameters);
                return -1;
            } else {
                // Si no existe el like, crear el like y incrementar los likes del post
                await session.run(`
                MATCH (u:User {id: $userId}), (p:Post {id: $postId})
                MERGE (u)-[r:POST_LIKED]->(p)
                ON CREATE SET p.likes = coalesce(p.likes, 0) + 1
            `, parameters);
                return 1;
            }
        } catch (error) {
            console.error('Error al manejar el like', error);
        } finally {
            await session.close();
        }
        return 0; // En caso de error, retornar 0
    }


}