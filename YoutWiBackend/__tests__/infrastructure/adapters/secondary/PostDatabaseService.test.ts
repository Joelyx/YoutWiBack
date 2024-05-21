import 'reflect-metadata';
import { anything, instance, mock, verify, when } from 'ts-mockito';
import { v4 as uuidv4 } from 'uuid';
import { PostDatabaseService } from '../../../../src/infrastructure/adapters/secondary/services/PostDatabaseService';
import { Post } from '../../../../src/domain/models/Post';
import { User } from '../../../../src/domain/models/User';
import { Video } from '../../../../src/domain/models/Video';
import { Comment } from '../../../../src/domain/models/Comment';

describe('PostDatabaseService', () => {
    let service: PostDatabaseService;
    let mockDriver: any;
    let mockSession: any;
    let mockTransaction: any;

    beforeEach(() => {
        mockDriver = mock<any>();
        mockSession = mock<any>();
        mockTransaction = mock<any>();

        when(mockDriver.session()).thenReturn(instance(mockSession));
        when(mockSession.beginTransaction()).thenReturn(instance(mockTransaction));

        service = new PostDatabaseService(instance(mockDriver));
    });

    it('should save post successfully', async () => {
        const post = new Post();
        const user = mock(User);
        const video = mock(Video);
        const commentUser = mock(User);
        const comment = new Comment();
        comment.user = instance(commentUser);

        post.user = instance(user);
        post.video = instance(video);
        post.comments = [comment];
        post.createdAt = new Date();

        when(user.getId).thenReturn(1);
        when(video.id).thenReturn('videoId');
        when(commentUser.getId).thenReturn(1);

        await service.savePost(post);

        verify(mockTransaction.run(anything(), anything())).twice();
        verify(mockTransaction.commit()).once();
    });

    it('should rollback transaction when error occurs while saving post', async () => {
        const post = new Post();
        const user = mock(User);
        const video = mock(Video);
        const commentUser = mock(User);
        const comment = new Comment();
        comment.user = instance(commentUser);

        post.user = instance(user);
        post.video = instance(video);
        post.comments = [comment];
        post.createdAt = new Date();

        when(user.getId).thenReturn(1);
        when(video.id).thenReturn('videoId');
        when(commentUser.getId).thenReturn(1);
        when(mockTransaction.run(anything(), anything())).thenThrow(new Error());

        await service.savePost(post);

        verify(mockTransaction.rollback()).once();
    });

    it('should find post by id successfully', async () => {
        const postId = uuidv4();
        const record = { get: jest.fn().mockReturnValue(postId) };
        when(mockSession.run(anything(), anything())).thenReturn({ records: [record] });

        const result = await service.findPost(postId);

        expect(result.id).toBe(postId);
    });

    it('should return empty array when no comments found for a post', async () => {
        const postId = uuidv4();
        when(mockSession.run(anything(), anything())).thenReturn({ records: [] });

        const result = await service.findPostComments(postId);

        expect(result).toEqual([]);
    });



    it('should find comments by post id', async () => {
        const postId = uuidv4();
        const record = { get: jest.fn().mockReturnValue('commentId') };
        when(mockSession.run(anything(), anything())).thenReturn({ records: [record] });

        const result = await service.findPostComments(postId);

        expect(result.length).toBe(1);
        expect(result[0].id).toBe('commentId');
    });


});
