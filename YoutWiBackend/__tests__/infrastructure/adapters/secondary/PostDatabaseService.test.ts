import "reflect-metadata";
import { PostDatabaseService } from "../../../../src/infrastructure/adapters/secondary/services/PostDatabaseService";
import { Post } from "../../../../src/domain/models/Post";
import { Comment } from "../../../../src/domain/models/Comment";
import { User } from "../../../../src/domain/models/User";
import { Video } from "../../../../src/domain/models/Video";
import neo4j, {Driver} from "neo4j-driver";

jest.mock("neo4j-driver", () => ({
    driver: jest.fn().mockImplementation(() => ({
        session: jest.fn(() => ({
            run: jest.fn(),
            close: jest.fn(),
            beginTransaction: jest.fn().mockResolvedValue({
                run: jest.fn(),
                commit: jest.fn(),
                rollback: jest.fn()
            })
        }))
    }))
}));
describe('PostDatabaseService', () => {
    let service: PostDatabaseService;
    let sessionMock: any;
    let transactionMock: any;
    let driverMock: Driver;

    beforeEach(() => {
        driverMock = neo4j.driver("") as any;
        sessionMock = driverMock.session();
        transactionMock = sessionMock.beginTransaction();

        service = new PostDatabaseService();
    });

    describe('savePost', () => {
        it('should save a post and its comments correctly', async () => {
            const post = new Post();
            post.user = new User();
            post.user.setId = 1;
            post.video = new Video();
            post.video.id = 'video-123';
            post.content = 'A new post';
            post.createdAt = new Date();

            let user = new User();
            user.setId = 2;

            let comment = new Comment();
            comment.user = user;
            comment.content = 'Great post!';
            comment.createdAt = new Date();

            post.comments = [comment];

            await service.savePost(post);

            expect(sessionMock.beginTransaction).toHaveBeenCalled();
            expect(transactionMock.run).toHaveBeenCalledTimes(2);
            expect(transactionMock.commit).toHaveBeenCalled();
            expect(sessionMock.close).toHaveBeenCalled();
        });

        it('should handle transaction rollback on error', async () => {
            const post = new Post();
            transactionMock.run.mockRejectedValue(new Error('Database error'));

            await expect(service.savePost(post)).rejects.toThrow('Database error');

            expect(transactionMock.rollback).toHaveBeenCalled();
            expect(sessionMock.close).toHaveBeenCalled();
        });
    });

    describe('findPost', () => {
        it('should return a post by ID', async () => {
            const fakeReturn = {
                records: [
                    {
                        get: jest.fn((prop) => {
                            switch (prop) {
                                case 'id': return 'post-123';
                                case 'content': return 'Some content';
                                case 'createdAt': return '2021-01-01T00:00:00Z';
                                case 'userId': return 'user-123';
                                case 'userName': return 'John Doe';
                                case 'videoId': return 'video-123';
                                case 'videoTitle': return 'A cool video';
                                case 'likes': return 10;
                            }
                        })
                    }
                ]
            };
            sessionMock.run.mockResolvedValue(fakeReturn);

            const result = await service.findPost('post-123');
            expect(result.id).toBe('post-123');
            expect(sessionMock.run).toHaveBeenCalledWith(expect.any(String), { postId: 'post-123' });
            expect(sessionMock.close).toHaveBeenCalled();
        });
    });
    describe('findPostComments', () => {
        it('should retrieve comments for a given post', async () => {
            sessionMock.run.mockResolvedValue({
                records: [
                    {
                        get: (key: string) => {
                            if (key === 'commentId') return 'comment-1';
                            if (key === 'content') return 'Nice post!';
                            if (key === 'createdAt') return new Date().toISOString();
                            if (key === 'userId') return 'user-1';
                            if (key === 'username') return 'John Doe';
                        }
                    }
                ]
            });

            const comments = await service.findPostComments('post-1');
            expect(comments.length).toBe(1);
            expect(comments[0].id).toEqual('comment-1');
            expect(sessionMock.run).toHaveBeenCalled();
        });
    });

    describe('findPostsWithLimitAndOffset', () => {
        it('should paginate posts correctly', async () => {
            sessionMock.run.mockResolvedValue({
                records: [
                    {
                        get: jest.fn((key) => {
                            switch (key) {
                                case 'id': return 'post-1';
                                case 'content': return 'Post content';
                                case 'createdAt': return new Date().toISOString();
                                case 'userId': return 'user-1';
                                case 'userName': return 'Jane Doe';
                                case 'videoId': return 'video-1';
                                case 'videoTitle': return 'Video title';
                                case 'likes': return 5;
                            }
                        })
                    }
                ]
            });

            const posts = await service.findPostsWithLimitAndOffset(10, 0);
            expect(posts.length).toBe(1);
            expect(posts[0].id).toBe('post-1');
            expect(sessionMock.run).toHaveBeenCalledWith(expect.any(String), { limit: 10, offset: 0 });
        });
    });

    describe('savePostComment', () => {
        it('should save a comment for a post', async () => {
            let user = new User();
            user.setId=2;

            let comment = new Comment();
            comment.user = (user);
            comment.content = ('Comment content');
            comment.createdAt = (new Date());

            await service.savePostComment('post-1', comment);
            expect(transactionMock.run).toHaveBeenCalled();
        });
    });

    describe('likePost', () => {
        it('should handle likes correctly', async () => {
            sessionMock.run.mockResolvedValueOnce({ records: [] });  // No existing likes
            sessionMock.run.mockResolvedValueOnce({ records: [{ get: () => ({}) }] });  // Successful like

            const result = await service.likePost('post-1', 'user-1');
            expect(result).toBe(1);  // Like added
            expect(sessionMock.run).toHaveBeenCalledTimes(2);
        });
    });

    describe('findUserPosts', () => {
        it('should retrieve posts by a specific user', async () => {
            sessionMock.run.mockResolvedValue({
                records: [
                    {
                        get: jest.fn((key) => {
                            switch (key) {
                                case 'id': return 'post-2';
                                case 'content': return 'Another post';
                                case 'createdAt': return new Date().toISOString();
                                case 'userId': return 'user-2';
                                case 'userName': return 'Alice';
                                case 'videoId': return 'video-2';
                                case 'videoTitle': return 'Second video';
                                case 'likes': return 10;
                            }
                        })
                    }
                ]
            });

            const posts = await service.findUserPosts('user-2');
            expect(posts.length).toBe(1);
            expect(posts[0].id).toBe('post-2');
            expect(sessionMock.run).toHaveBeenCalled();
        });
    });

});
