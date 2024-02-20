import {injectable} from "inversify";
import {IPostRepository} from "../../../../domain/port/secondary/IPostRepository";
import {Post} from "../../../../domain/models/Post";
import neo4j from "neo4j-driver";
import {Comment} from "../../../../domain/models/Comment";
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
            await txc.run(query, parameters);
            let comments = post.comments;
            for (const comment of comments) {
                const parameters = {
                    userId: comment.user.getId,
                    commentId: comment.id,
                    postId: post.id,
                    content: comment.content,
                    createdAt: comment.createdAt
                };
                await txc.run(queryComments, parameters);
            }
            await txc.commit();
            console.log('Transacción confirmada');
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
            MATCH (v:Video)-[:HAS_VIDEO]->(p)
            RETURN p.id as id, p.content as content, p.createdAt as createdAt, u.id as userId, u.name as userName, v.id as videoId
        `;
        const session = driver.session();
        const result = await session.run(query, {postId});
        const record = result.records[0];
        const post = new Post();
        post.id = record.get('id');
        post.content = record.get('content');
        post.createdAt = record.get('createdAt');
        post.user.setId = record.get('userId');
        post.user.setUsername = record.get('userName');
        post.video = record.get('videoId');
        await session.close();
        return post;
    }

    public async findPostComments(postId: string): Promise<Comment[]> {
        const query = `
            MATCH (p:Post {id: $postId})-[:BELONGS_TO]->(c:Comment)
            MATCH (u:User)-[:COMMENTED]->(c)
            RETURN c.id as id, c.content as content, c.createdAt as createdAt, u.id as userId, u.name as userName
        `;
        const session = driver.session();
        const result = await session.run(query, {postId});
        const comments = result.records.map(record => {
            const comment = new Comment();
            comment.id = record.get('id');
            comment.content = record.get('content');
            comment.createdAt = record.get('createdAt');
            comment.user.setId = record.get('userId');
            comment.user.setUsername = record.get('userName');
            return comment;
        });
        await session.close();
        return comments;
    }

    async findPostsWithLimitAndOffset(limit: number, offset: number): Promise<Post[]> {
        const query = `
            MATCH (p:Post)
            MATCH (u:User)-[:PUBLISHED]->(p)
            MATCH (v:Video)-[:HAS_VIDEO]->(p)
            RETURN p.id as id, p.content as content, p.createdAt as createdAt, u.id as userId, u.name as userName, v.id as videoId
            ORDER BY p.createdAt DESC
            SKIP $offset LIMIT $limit
        `;
        const session = driver.session();
        const result = await session.run(query, {limit, offset});
        const posts = result.records.map(record => {
            const post = new Post();
            post.id = record.get('id');
            post.content = record.get('content');
            post.createdAt = record.get('createdAt');
            post.user.setId = record.get('userId');
            post.user.setUsername = record.get('userName');
            post.video = record.get('videoId');
            return post;
        });
        await session.close();
        return posts;

    }
}